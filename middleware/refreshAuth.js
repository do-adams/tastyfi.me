'use strict';

const User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService');

	
/**
 * Refreshes the Spotify Auth Access Token if Expired.
 * 
 * Middleware MUST be used in a route that has access to
 * the user id param
 */
async function refreshAuth(req, res, next) {
	User.findById(req.params.id, async function(err, user) {
		if (err || !user) {
			return next(err || new Error('User not found.'));
		}
		const now = new Date(Date.now()), expDate = user.access.expirationDate;
		if (now >= expDate) {
			try {
				const response = await SpotifyService.refreshAccessToken(user.refreshToken);
				if (response.statusCode !== 200) {
					throw new Error(JSON.stringify(response.body));
				}
				user.access.accessToken = response.body.access_token;
				user.access.expirationDate = User.getExpirationDate(response.body.expires_in);
				user.save();
				return next();
			} catch (err) {
				return next(err);
			}
		} else {
			return next();
		}
	});
}

module.exports = refreshAuth;