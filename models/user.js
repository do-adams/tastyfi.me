'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	spotifyId: String,
	displayName: String,
	accessToken: String,
	refreshToken: String,
	expiresIn: Number
}, { 
	timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;