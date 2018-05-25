'use strict';

require('dotenv').config();

const request = require('request');

class SpotifyRequestService {

	constructor() {}

	getUserProfile(user, cb) {
		const options = {
			url: `https://api.spotify.com/v1/users/${user.spotifyId}`,
			headers: {
				Authorization: 'Bearer ' + user.access.accessToken
			},
			json: true
		};
		request(options, function(err, response, body) {
			cb(err, response, body);
		});
	}

	refreshAccessToken(user, cb) {
		// Request new access token
		const options = {
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
			},
			form: {
				grant_type: 'refresh_token',
				refresh_token: user.refreshToken 
			}, 
			json: true
		};
		request.post(options, function(err, response, body) {
			cb(err, response, body);
		});
	}
}

module.exports = SpotifyRequestService;