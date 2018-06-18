'use strict';

const express = require('express'),
	User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService'),
	refreshAuth = require('../middleware/users/refreshAuth'),
	processAudioFeatures = require('../helpers/processAudioFeatures');

const router = express.Router({mergeParams: true});

router.get('/', refreshAuth, async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error('User not found.');
		}

		// Parse query string
		const ranges = ['short_term', 'medium_term', 'long_term'];
		let timeRange = req.query.time_range;
		if (!timeRange) {
			timeRange = ranges[0];
		} else if (!ranges.includes(timeRange)) {
			throw new Error('Invalid time range value');
		}

		// Request data from Spotify concurrently
		const responses = await Promise.all([
			SpotifyService.getUserProfile(user.spotifyId, user.access.accessToken),
			SpotifyService.getTopArtists(user.access.accessToken, {
				limit: '50',
				time_range: timeRange
			}),
			SpotifyService.getTopTracks(user.access.accessToken, {
				limit: '50',
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

		return res.render('users/show', {
			profile: responses[0].body,
			topArtists: responses[1].body,
			topTracks: responses[2].body,
			audioFeatures
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;