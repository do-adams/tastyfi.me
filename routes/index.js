'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	return res.send('Welcome to Tastyfi.me');
});

module.exports = router;