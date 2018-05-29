'use strict';

const User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService');
	
/**
 * Refreshes the Spotify Auth Access Token if Expired.
 * 
 * Middleware MUST be used in a route that has access to
 * the user id param
 */
function refreshAuth(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if (err || !user) {
			return next(err || new Error('User not found.'));
		}

		const now = new Date(Date.now()), expDate = user.access.expirationDate;

		if (now >= expDate) {
			SpotifyService.refreshAccessToken(user.refreshToken, function(err, response, body) {
				if (err || response.statusCode !== 200) {
					return next(err || 
						new Error('There was an error when authorizing this Spotify account.'));
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

module.exports = refreshAuth;