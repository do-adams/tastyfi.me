'use strict';

const express = require('express'),
	User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService'),
	refreshAuth = require('../middleware/refreshAuth');

const router = express.Router({mergeParams: true});

router.get('/', refreshAuth, async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error('User not found.');
		}
		// Request data from Spotify concurrently
		const data = await Promise.all([
			SpotifyService.getUserProfile(user.spotifyId, user.access.accessToken),
			SpotifyService.getTopArtists(user.access.accessToken, {
				limit: '50',
				time_range: 'long_term'
			}),
			SpotifyService.getTopTracks(user.access.accessToken, {
				limit: '50',
				time_range: 'long_term'
			})
		]);
		// Check responses
		data.forEach(response => {
			if (response.statusCode !== 200) {
				throw new Error(JSON.stringify(response.body));
			}
		});
		return res.json({
			profile: data[0].body,
			topArtists: data[1].body,
			topTracks: data[2].body
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;