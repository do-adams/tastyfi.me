'use strict';

require('dotenv').config();

const express = require('express'),
	User = require('../models/User'),
	cacherole = require('cacherole'),
	SpotifyService = require('../services/SpotifyService'),
	refreshAuth = require('../middleware/users/refreshAuth'),
	processAudioFeatures = require('../helpers/processAudioFeatures');

// Cached action for loading user profile data
const cacheDuration = parseInt(process.env.SPOTIFY_CACHE_DURATION_MS || 86400000),
	loadUserProfile = cacherole.put({
	action: async (user, limit, timeRange) => {
		// Request data from Spotify concurrently
		const responses = await Promise.all([
			SpotifyService.getUserProfile(user.spotifyId, user.access.accessToken),
			SpotifyService.getTopArtists(user.access.accessToken, {
				limit,
				time_range: timeRange
			}),
			SpotifyService.getTopTracks(user.access.accessToken, {
				limit,
				time_range: timeRange
			})
		]);
		// Check responses
		responses.forEach(response => {
			if (response.statusCode !== 200) {
				throw new Error(JSON.stringify(response.body));
			}
		});
		// Get audio features analysis
		const topTracks = responses[2].body.items.map(i => i.id);
		const audioResponse = await SpotifyService.getAudioFeatures(user.access.accessToken, topTracks);
		if (audioResponse.statusCode !== 200) {
			throw new Error(JSON.stringify(audioResponse.body));
		}
		const audioFeatures = processAudioFeatures(audioResponse);

		const userProfile = {
			profile: responses[0].body,
			topArtists: responses[1].body,
			topTracks: responses[2].body,
			audioFeatures
		};

		return userProfile;
	},
	time: cacheDuration
});

const router = express.Router({mergeParams: true});

router.get('/', refreshAuth, async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error('User not found.');
		}
		// Parse query string
		const ranges = ['short_term', 'medium_term', 'long_term'];
		let timeRange = req.query.time_range, limit = '50';
		if (!timeRange) {
			timeRange = ranges[0];
		} else if (!ranges.includes(timeRange)) {
			throw new Error('Invalid time range query value');
		}

		const key = `user_id=${req.params.id}&time_range=${timeRange}&limit=${limit}`,
			userProfile = await loadUserProfile(key)(user, limit, timeRange);

		return res.render('users/show', userProfile);
	} catch (err) {
		return next(err);
	}
});

module.exports = router;