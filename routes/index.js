'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	return res.render('landing');
});

router.get('/logout', (req, res) => {
	req.logout();
	return res.redirect('/');
});

module.exports = router;