'use strict';

require('dotenv').config();

const request = require('request');

function makeRequestAsync(options) {
	return new Promise((resolve, reject) => {
		request(options, function(err, response) {
			if (err) return reject(err);
			return resolve(response);
		});
	});
}

class SpotifyService {

	constructor() {}

	static getUserProfile(spotifyId, accessToken) {
		const options = {
			url: `https://api.spotify.com/v1/users/${spotifyId}`,
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + accessToken
			},
			json: true
		};
		return makeRequestAsync(options);
	}

	/**
	 * 
	 * @param {*} accessToken 
	 * @param {*} params Optional query string parameters: limit, offset, and time_range.
	 */
	static getTopArtists(accessToken, params) {
		// Safely extract the necessary params
		const query = Object.assign({}, 
			params.limit ? {limit: params.limit} : {},
			params.offset ? {offset: params.offset} : {},
			params.time_range ? {time_range: params.time_range} : {});

		const options = {
			url: 'https://api.spotify.com/v1/me/top/artists',
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + accessToken
			},
			qs: query,
			json: true
		};
		return makeRequestAsync(options);
	}

	/**
	 * 
	 * @param {*} accessToken 
	 * @param {*} params Optional query string parameters: limit, offset, and time_range.
	 */
	static getTopTracks(accessToken, params) {
		// Safely extract the necessary params
		const query = Object.assign({}, 
			params.limit ? {limit: params.limit} : {},
			params.offset ? {offset: params.offset} : {},
			params.time_range ? {time_range: params.time_range} : {});

		const options = {
			url: 'https://api.spotify.com/v1/me/top/tracks',
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + accessToken
			},
			qs: query,
			json: true
		};
		return makeRequestAsync(options);
	}

	static refreshAccessToken(refreshToken) {
		// Request new access token
		const options = {
			url: 'https://accounts.spotify.com/api/token',
			method: 'POST',
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
		return makeRequestAsync(options);
	}
}

module.exports = SpotifyService;