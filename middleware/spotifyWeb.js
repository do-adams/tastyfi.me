'use strict';

const User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService');

module.exports = {
	
	getUserProfile: function getUserProfile(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			if (err || !user) {
				return next(err || new Error('User not found.'));
			}
			SpotifyService.getUserProfile(user.spotifyId, user.access.accessToken, function(err, response, body) {
				if (err || response.statusCode !== 200) {
					return next(err || new Error('Error retrieving profile data from Spotify'));
				} 
				// Update or create the spotifyWeb object with the new data
				res.locals.spotifyWeb = Object.assign({}, 
					res.locals.spotifyWeb, 
					{ userProfile: body });
				return next();
			});
		});
	},

	getTopArtists: function getTopArtists(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			if (err || !user) {
				return next(err || new Error('User not found.'));
			}
			const params = {
				limit: '50',
				time_range: 'long_term'
			};
			SpotifyService.getTopArtists(user.access.accessToken, params, function(err, response, body) {
				if (err || response.statusCode !== 200) {
					return next(err || new Error('Error retrieving artist data from Spotify'));
				} 
				// Update or create the spotifyWeb object with the new data
				res.locals.spotifyWeb = Object.assign({}, 
					res.locals.spotifyWeb, 
					{ topArtists: body });
				return next();
			});
		});
	},

	getTopTracks: function getTopTracks(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			if (err || !user) {
				return next(err || new Error('User not found.'));
			}
			const params = {
				limit: '50',
				time_range: 'long_term'
			};
			SpotifyService.getTopTracks(user.access.accessToken, params, function(err, response, body) {
				if (err || response.statusCode !== 200) {
					return next(err || new Error('Error retrieving track data from Spotify'));
				} 
				// Update or create the spotifyWeb object with the new data
				res.locals.spotifyWeb = Object.assign({}, 
					res.locals.spotifyWeb, 
					{ topTracks: body });
				return next();
			});
		});
	}

};