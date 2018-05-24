'use strict';

require('dotenv').config();

const path = require('path'),
	mongoose = require('mongoose'),
	express = require('express'),
	app = express(),
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport'),
	SpotifyStrategy = require('passport-spotify').Strategy,
	User = require('./models/user');

// DB SETUP
mongoose.connect('mongodb://localhost/tastyfi_me', function(err) {
	if (err) throw err;
});

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

// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT SPOTIFY AUTHENTICATION SETUP
passport.use(new SpotifyStrategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: process.env.REDIRECT_URI || 'http://localhost:3000/auth/spotify/callback'
}, 
	function(accessToken, refreshToken, expires_in, profile, done) {
		User.findOne({spotifyId: profile.id}, function(err, user) {
			if (err) {
				return done(err);
			} else if (!user) {
				User.create({ 
					spotifyId: profile.id,
					displayName: profile.displayName,
					accessToken: accessToken,
					refreshToken: refreshToken,
					expires_in: expires_in
				}, function(err, newUser) {
					return done(err, newUser);
				});
			} else {
				user.spotifyId = profile.id;
				user.displayName = profile.displayName;
				user.accessToken = accessToken;
				user.refreshToken = refreshToken;
				user.expires_in = expires_in;
				user.save(function(err, updatedUser) {
					return done(err, updatedUser);
				});
			}
		});
}));

// PASSPORT SESSION SETUP
passport.serializeUser(function(user, done) {
	return done(null, user._id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		return done(err, user);
	});
});

// ROUTES
app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.get('/success', (req, res) => {
	res.send('Authentication was successful!');
});

// AUTH ROUTES
app.get('/auth/spotify', passport.authenticate('spotify'));

app.get('/auth/spotify/callback', 
	passport.authenticate('spotify', { scope: ['user-top-read'], failureRedirect: '/'}), 
	(req, res) => {
		res.redirect('/success');
	}
);

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
	console.log(`Server started on port ${port}`);
});