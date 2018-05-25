'use strict';

require('dotenv').config();

const path = require('path'),
	mongoose = require('mongoose'),
	express = require('express'),
	app = express(),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport'),
	SpotifyStrategy = require('passport-spotify').Strategy,
	User = require('./models/user'),
	request = require('request');

// DB SETUP
const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost/tastyfi_me';
mongoose.connect(dbUrl, function(err) {
	if (err) throw err;
});

// GENERAL EXPRESS SETUP
app.set('view engine', 'ejs');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
app.use(express.urlencoded({extended: true})); // bodyparser

// SESSION SETUP
app.use(session({
	store: new MongoStore({
		url: dbUrl
	}),
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

// PASSPORT SPOTIFY AUTHORIZATION SETUP
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
				// Register user
				User.create({ 
					spotifyId: profile.id,
					displayName: profile.displayName,
					access: { 
						accessToken: accessToken,
						expiresIn: expires_in
					},
					refreshToken: refreshToken
				}, function(err, newUser) {
					return done(err, newUser);
				});
			} else {
				// If user re-authorizes, update the user 
				user.spotifyId = profile.id;
				user.displayName = profile.displayName;
				user.access.accessToken = accessToken;
				user.access.dateCreated = new Date(Date.now());
				user.access.expiresIn = expires_in;
				user.refreshToken = refreshToken;
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

// TEMPLATE VIEW DATA MIDDLEWARE
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	return next();
});

// ROUTES
app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.get('/success', (req, res, next) => {
	if (!req.user) {
		// TODO: Remove when adding auth-checking middleware
		throw new Error();
	}
	const user = req.user;
	const options = {
		url: `https://api.spotify.com/v1/users/${user.spotifyId}`,
		headers: {
			Authorization: 'Bearer ' + user.access.accessToken
		},
		json: true
	};
	request(options, function(err, response, body) {
		if (err || response.statusCode !== 200) {
			return next(err || new Error('Error retrieving data from Spotify'));
		} else {
			res.json(body);
		}
	});
});

// TODO: REFACTOR INTO SPOTIFY ACCESS TOKEN REFRESH MIDDLEWARE 
app.get('/refresh', (req, res, next) => {
	if (req.isAuthenticated()) {
		const user = req.user;

		// Determine whether token has expired or not
		const now = new Date(Date.now());
		const tokenDate = user.access.dateCreated;
		const elapsedTime = Math.floor(Math.abs(now - tokenDate) / 1000); // in seconds
		const expirationPeriod = user.access.expiresIn - 60 * 5; // add a five minute window to avoid timing the API
		const hasExpired = elapsedTime >= user.access.expiresIn - expirationPeriod;

		if (hasExpired) {
			// Request new access token
			const options = {
				url: 'https://accounts.spotify.com/api/token',
				headers: {
					Authorization: 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
				},
				form: {
					grant_type: 'refresh_token',
					refresh_token: user.refreshToken 
				}, 
				json: true
			};
			request.post(options, function(err, response, body) {
				if (err || response.statusCode !== 200) {
					// Log the user out if refresh attempt fails
					console.error(err && err.stack);
					req.logout();
					req.flash('error', 'There was an error when authorizing your Spotify account. Please sign in again');
					return res.redirect('/');
				} else {
					user.access.accessToken = body.access_token;
					user.access.dateCreated = now; // use earlier Date value to avoid timing issues
					user.access.expiresIn = body.expires_in;
					user.save();
					return res.json(body);
				}
			});
		} else { 
			return res.send('Access token has not expired');
		}
	} else {
		return res.send('User is not logged in');
	}
});

// AUTH ROUTES
app.get('/auth/spotify', passport.authenticate('spotify'));

app.get('/auth/spotify/callback', 
	passport.authenticate('spotify', { scope: ['user-top-read'], failureRedirect: '/'}), 
	(req, res) => {
		res.redirect('/success');
	}
);

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
		console.error(err.stack);
		req.flash('error', err.message);
		res.status(500);
		res.redirect('back');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});