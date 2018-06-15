'use strict';

const express = require('express'),
	User = require('../models/User'),
	SpotifyService = require('../services/SpotifyService'),
	refreshAuth = require('../middleware/users/refreshAuth');

const router = express.Router({mergeParams: true});

router.get('/', refreshAuth, async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error('User not found.');
		}
		// Request data from Spotify concurrently
		const responses = await Promise.all([
			SpotifyService.getUserProfile(user.spotifyId, user.access.accessToken),
			SpotifyService.getTopArtists(user.access.accessToken, {
				limit: '50',
				time_range: 'long_term'
			}),
			SpotifyService.getTopTracks(user.access.accessToken, {
				limit: '50',
				time_range: 'long_term'
			})
		]);
		// Check responses
		responses.forEach(response => {
			if (response.statusCode !== 200) {
				throw new Error(JSON.stringify(response.body));
			}
		});

		return res.render('users/show', {
			profile: responses[0].body,
			topArtists: responses[1].body,
			topTracks: responses[2].body
		});
	} catch (err) {
		return next(err);
	}
});

router.get('/audio', refreshAuth, async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error('User not found');
		}
		const trackResponse = await SpotifyService.getTopTracks(user.access.accessToken, {
			limit: '50',
			time_range: 'long_term'
		});
		if (trackResponse.statusCode !== 200) {
			throw new Error(JSON.stringify(trackResponse.body));
		}
		const topTracks = trackResponse.body.items.map(i => i.id);
		const audioResponse = await SpotifyService.getAudioFeatures(user.access.accessToken, topTracks);
		if (audioResponse.statusCode !== 200) {
			throw new Error(JSON.stringify(audioResponse.body));
		}

		const analysis = audioResponse.body;
		const count = analysis.audio_features.length;

		const featureTallies = {
			keys: new Array(12).fill(0), // Keys are in Pitch Class notation (0-11)
			modes: new Array(2).fill(0) // 0 - Minor, 1 - Major
		};
		const featureSums = analysis.audio_features.reduce((acc, curr) => {
			// Update tallies
			featureTallies.keys[curr.key] += 1;
			featureTallies.modes[curr.mode] += 1;

			// Update sums
			Object.keys(acc).forEach(feature => {
				acc[feature] += curr[feature];
			});
			return acc;
		}, {
			acousticness: 0,
			danceability: 0,
			duration_ms: 0,
			energy: 0,
			instrumentalness: 0,
			liveness: 0,
			tempo: 0,
			valence: 0
		});

		const featureAverages = {};
		Object.keys(featureSums).forEach((feature) => {
			featureAverages[feature] = featureSums[feature] / count;
		});

		return res.json({
			feature_tallies : featureTallies,
			feature_averages: featureAverages
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;