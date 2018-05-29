'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	spotifyId: String,
	displayName: String,
	access: {
		accessToken: String,
		expirationDate: Date
	},
	refreshToken: String
}, {
	timestamps: true
});

/**
 * 
 * @param {*} expiresIn The number of seconds until expiration.
 * Typically expected to be 3600 secs or one hour.
 */
userSchema.statics.getExpirationDate = function(expiresIn) {
	// Establish an earlier cutoff to avoid timing issues and convert to ms
	const cutoff = 600; // 10 mins
	expiresIn = (expiresIn - cutoff) * 1000;

	const expirationDate = new Date(Date.now() + expiresIn);
	return expirationDate;
};

const User = mongoose.model('User', userSchema);

module.exports = User;