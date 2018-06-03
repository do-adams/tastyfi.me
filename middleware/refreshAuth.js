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
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error('User not found.');
		}
		const now = new Date(Date.now()), expDate = user.access.expirationDate;
		if (now >= expDate) {
			const response = await SpotifyService.refreshAccessToken(user.refreshToken);
			if (response.statusCode !== 200) {
				throw new Error(JSON.stringify(response.body));
			}
			user.access.accessToken = response.body.access_token;
			user.access.expirationDate = User.getExpirationDate(response.body.expires_in);
			await user.save();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

module.exports = refreshAuth;