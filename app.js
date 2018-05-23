require('dotenv').config();

const path = require('path'),
	express = require('express'),
	app = express(),
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport'),
	SpotifyStrategy = require('passport-spotify').Strategy;

// GENERAL EXPRESS SETUP
app.set('view engine', 'ejs');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
app.use(express.urlencoded({extended: true})); // bodyparser

// SESSION SETUP
app.use(session({
	secret: process.env.SESSION_SECRET || 'Debug Session Key',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // 2 weeks
	}
}));
app.use(flash());

app.get('/', (req, res) => {
	res.send('Hello world!');
});

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
	console.log(`Server started on port ${port}`);
});

