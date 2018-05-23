require('dotenv').config();

const express = require('express'),
	app = express(),
	session = require('express-session'),
	passport = require('passport'),
	SpotifyStrategy = require('passport-spotify').Strategy;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.send('Hello world!');
});

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
	console.log(`Server started on port ${port}`);
});

