'use strict';

const express = require('express'),
	User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService'),
	refreshAuth = require('../middleware/refreshAuth');

const router = express.Router({mergeParams: true});

router.get('/', refreshAuth, async (req, res, next) => {
	User.findById(req.params.id, async function(err, user) {
		if (err || !user) {
			return next(err || new Error('User not found.'));
		}
		try {
			const response = await SpotifyService.getUserProfile(user.spotifyId, user.access.accessToken); 
			if (response.statusCode !== 200) {
				throw new Error(JSON.stringify(response.body));
			} 
			return res.json(response.body);
		} catch (err) {
			return next(err);
		}
	});
});

router.get('/top-artists', refreshAuth, async (req, res, next) => {
	User.findById(req.params.id, async function(err, user) {
		if (err || !user) {
			return next(err || new Error('User not found.'));
		}
		const params = {
			limit: '50',
			time_range: 'long_term'
		};
		try {
			const response = await SpotifyService.getTopArtists(user.access.accessToken, params);
			if (response.statusCode !== 200) {
				throw new Error(JSON.stringify(response.body));
			} 
			return res.json(response.body);
		} catch (err) {
			return next(err);
		}
	});
});

router.get('/top-tracks', refreshAuth, async (req, res, next) => {
	User.findById(req.params.id, async function(err, user) {
		if (err || !user) {
			return next(err || new Error('User not found.'));
		}
		const params = {
			limit: '50',
			time_range: 'long_term'
		};
		try {
			const response = await SpotifyService.getTopTracks(user.access.accessToken, params);
			if (response.statusCode !== 200) {
				throw new Error(JSON.stringify(response.body));
			} 
			return res.json(response.body);
		} catch (err) {
			return next(err);
		}
	});
});

module.exports = router;