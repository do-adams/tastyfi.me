'use strict';

const express = require('express'),
	User = require('../models/User'),
	spotifyRequest = require('../services/spotifyRequestService')();

const router = express.Router({mergeParams: true});

router.get('/', (req, res, next) => {
	User.findById(req.params.id, function(err, user) {
		if (err || !user) {
			return next(err || new Error('User not found. Please try authorizing this account.'));
		}
		spotifyRequest.getUserProfile(user.spotifyId, user.access.accessToken, function(err, response, body) {
			if (err || response.statusCode !== 200) {
				return next(err || new Error('Error retrieving data from Spotify'));
			} 
			return res.json(body);
		});
	});
});

// TODO: REFACTOR INTO SPOTIFY ACCESS TOKEN REFRESH MIDDLEWARE 
router.get('/refresh', (req, res, next) => {
	User.findById(req.params.id, function(err, user) {
		if (err || !user) {
			return next(err || new Error('User not found. Please try authorizing this account.'));
		}
		spotifyRequest.refreshAccessToken(user.refreshToken, function(err, response, body) {
			if (err || response.statusCode !== 200) {
				return next(err || 
					new Error('There was an error when authorizing your Spotify account. Please sign in again'));
			} 				
			user.access.accessToken = body.access_token;
			user.access.expirationDate = User.getExpirationDate(body.expires_in);
			user.save();
			return res.json(body);
		});
	});
});

module.exports = router;