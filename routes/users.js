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
		// Request data from Spotify concurrently
		const responses = await Promise.all([
			SpotifyService.getUserProfile(user.spotifyId, user.access.accessToken),
			SpotifyService.getTopArtists(user.access.accessToken, {
				limit: '50',
				time_range: 'short_term'
			}),
			SpotifyService.getTopTracks(user.access.accessToken, {
				limit: '50',
				time_range: 'short_term'
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