'use strict';

require('dotenv').config();

const request = require('request');

module.exports = function spotifyService() {

	function getUserProfile(spotifyId, accessToken, cb) {
		const options = {
			url: `https://api.spotify.com/v1/users/${spotifyId}`,
			headers: {
				Authorization: 'Bearer ' + accessToken
			},
			json: true
		};
		request(options, function(err, response, body) {
			cb(err, response, body);
		});
	}

	function refreshAccessToken(refreshToken, cb) {
		// Request new access token
		const options = {
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				Authorization: 'Basic ' + 
				Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
			},
			form: {
				grant_type: 'refresh_token',
				refresh_token: refreshToken 
			}, 
			json: true
		};
		request.post(options, function(err, response, body) {
			cb(err, response, body);
		});
	}

	return {
		getUserProfile: getUserProfile,
		refreshAccessToken: refreshAccessToken
	};
};