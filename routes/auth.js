'use strict';

const express = require('express');

const router = express.Router();

function authRouter(passport) {
	router.get('/spotify', passport.authenticate('spotify', { scope: ['user-top-read'] }));

	router.get('/spotify/callback', 
		passport.authenticate('spotify', { scope: ['user-top-read'], failureRedirect: '/', failureFlash: true }), 
		(req, res) => {
			return res.redirect(`/users/${req.user._id}`);
		}
	);

	return router;
}

module.exports = authRouter;