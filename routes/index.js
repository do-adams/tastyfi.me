'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	return res.render('landing');
});

module.exports = router;