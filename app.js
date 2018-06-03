'use strict';

require('dotenv').config();

// async stack traces in development
if (process.env.NODE_ENV !== 'production') require('longjohn');

const path = require('path'),
	mongoose = require('mongoose'),
	express = require('express'),
	app = express(),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport'),
	SpotifyStrategy = require('passport-spotify').Strategy,
	User = require('./models/User');

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
	async function(accessToken, refreshToken, expires_in, profile, done) {
		try {
			const user = await User.findOne({spotifyId: profile.id});
			if (!user) { 
				// Register user
				const newUser = await User.create({ 
					spotifyId: profile.id,
					displayName: profile.displayName,
					access: { 
						accessToken: accessToken,
						expirationDate: User.getExpirationDate(expires_in)
					},
					refreshToken: refreshToken
				});
				return done(null, newUser);
			} else {
				// If user re-authorizes, update the user 
				user.spotifyId = profile.id;
				user.displayName = profile.displayName;
				user.access.accessToken = accessToken;
				user.access.expirationDate = User.getExpirationDate(expires_in);
				user.refreshToken = refreshToken;
				const updatedUser = await user.save();
				return done(null, updatedUser);
			}
		} catch (err) {
			return done(err);
		}
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

// RESPONSE LEVEL VARIABLES MIDDLEWARE
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	return next();
});

// ROUTES
const indexRoutes = require('./routes/index'),
	authRoutes = require('./routes/auth')(passport),	
	usersRoutes = require('./routes/users');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/users/:id', usersRoutes);

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