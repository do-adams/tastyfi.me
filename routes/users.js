'use strict';

const express = require('express'),
	User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService'),
	refreshAuth = require('../middleware/refreshAuth');

const router = express.Router({mergeParams: true});

router.get('/', refreshAuth, (req, res, next) => {
	User.findById(req.params.id, function(err, user) {
		if (err || !user) {
			return next(err || new Error('User not found. Please try authorizing this account.'));
		}
		SpotifyService.getUserProfile(user.spotifyId, user.access.accessToken, function(err, response, body) {
			if (err || response.statusCode !== 200) {
				return next(err || new Error('Error retrieving data from Spotify'));
			} 
			return res.json(body);
		});
	});
});

module.exports = router;