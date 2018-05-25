'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	spotifyId: String,
	displayName: String,
	access: {
		accessToken: String,
		dateCreated: { type: Date, default: Date.now },
		expiresIn: Number // in seconds
	},
	refreshToken: String
}, { 
	timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;