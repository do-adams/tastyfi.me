'use strict';

require('dotenv').config();

const request = require('request');

class SpotifyService {

	constructor() {}

	static getUserProfile(spotifyId, accessToken, cb) {
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

	/**
	 * 
	 * @param {*} accessToken 
	 * @param {*} params Optional query string parameters: limit, offset, and time_range.
	 * @param {*} cb 
	 */
	static getTopArtists(accessToken, params, cb) {
		// Safely extract the necessary params
		const query = Object.assign({}, 
			params.limit ? {limit: params.limit} : {},
			params.offset ? {offset: params.offset} : {},
			params.time_range ? {time_range: params.time_range} : {});

		const options = {
			url: 'https://api.spotify.com/v1/me/top/artists',
			headers: {
				Authorization: 'Bearer ' + accessToken
			},
			qs: query,
			json: true
		};
		request(options, function(err, response, body) {
			cb(err, response, body);
		});
	}

	/**
	 * 
	 * @param {*} accessToken 
	 * @param {*} params Optional query string parameters: limit, offset, and time_range.
	 * @param {*} cb 
	 */
	static getTopTracks(accessToken, params, cb) {
		// Safely extract the necessary params
		const query = Object.assign({}, 
			params.limit ? {limit: params.limit} : {},
			params.offset ? {offset: params.offset} : {},
			params.time_range ? {time_range: params.time_range} : {});

		const options = {
			url: 'https://api.spotify.com/v1/me/top/tracks',
			headers: {
				Authorization: 'Bearer ' + accessToken
			},
			qs: query,
			json: true
		};
		request(options, function(err, response, body) {
			cb(err, response, body);
		});
	}

	static refreshAccessToken(refreshToken, cb) {
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
}

module.exports = SpotifyService;