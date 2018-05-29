'use strict';

const User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService');

module.exports = function tokenizer() {
	/**
	 * Refreshes the Spotify Auth Access Token if Expired.
	 * 
	 * Middleware must be used in a route that has access to
	 * the user id param
	 */
	function refresh(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			if (err || !user) {
				return next(err || new Error('User not found. Please try authorizing this account.'));
			}

			const now = new Date(Date.now()), expDate = user.access.expirationDate;
			
			if (now >= expDate) {
				SpotifyService.refreshAccessToken(user.refreshToken, function(err, response, body) {
					if (err || response.statusCode !== 200) {
						return next(err || 
							new Error('There was an error when authorizing your Spotify account. Please sign in again'));
					} 				
					user.access.accessToken = body.access_token;
					user.access.expirationDate = User.getExpirationDate(body.expires_in);
					user.save();
					return next();
				});
			} else {
				return next();
			}
		});
	}

	return {
		refresh: refresh
	};
};