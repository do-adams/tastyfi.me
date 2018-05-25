'use strict';

const express = require('express'),
	User = require('../models/User'),
	spotifyRequest = require('../services/spotifyRequestService')();

const router = express.Router();

router.get('/user-profile', (req, res, next) => {
	const user = req.user;
	if (!user) {
		// TODO: Remove when adding auth-checking middleware
		throw new Error();
	}
	spotifyRequest.getUserProfile(user.spotifyId, user.access.accessToken, function(err, response, body) {
		if (err || response.statusCode !== 200) {
			return next(err || new Error('Error retrieving data from Spotify'));
		} else {
			res.json(body);
		}
	});
});

// TODO: REFACTOR INTO SPOTIFY ACCESS TOKEN REFRESH MIDDLEWARE 
router.get('/refresh', (req, res) => {
	if (req.isAuthenticated()) {
		const user = req.user;
		spotifyRequest.refreshAccessToken(user.refreshToken, function(err, response, body) {
			if (err || response.statusCode !== 200) {
				// Log the user out if refresh attempt fails
				console.error(err && err.stack);
				req.logout();
				req.flash('error', 'There was an error when authorizing your Spotify account. Please sign in again');
				return res.redirect('/');
			} else {
				user.access.accessToken = body.access_token;
				user.access.expirationDate = User.getExpirationDate(body.expires_in);
				user.save();
				return res.json(body);
			}
		});
	} else {
		return res.send('User is not logged in');
	}
});

module.exports = router;