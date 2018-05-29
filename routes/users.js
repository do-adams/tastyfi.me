'use strict';

const express = require('express'),
	refreshAuth = require('../middleware/refreshAuth'),
	spotifyWeb = require('../middleware/spotifyWeb');

const router = express.Router({mergeParams: true});

router.get('/', 
	refreshAuth, 
	spotifyWeb.getUserProfile, 
	spotifyWeb.getTopArtists,
	spotifyWeb.getTopTracks, (req, res) => {
		return res.json(res.locals.spotifyWeb);
});

module.exports = router;