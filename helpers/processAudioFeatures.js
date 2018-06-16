'use strict';

function getTone(pitchClass) {
	const tones = ['C', 'C♯ / D♭', 'D', 'D♯ / E♭', 'E', 'E♯ / F ', 'F♯ / G♭', 'G', 'G♯ / A♭', 'A', 'A♯ / B♭', 'B'];
	pitchClass = parseInt(pitchClass);
	return tones[pitchClass];
}

module.exports = function processAudioFeatures(audioFeaturesResponse) {
	const data = audioFeaturesResponse.body;
	const count = data.audio_features.length;
	
	if (count <= 0) return null;

	// Take track tallies of keys and modes
	const tallies = {
		keys: new Array(12).fill(0), // Keys are arranged in Pitch Class notation (0-11)
		modes: new Array(2).fill(0) // 0 - Minor, 1 - Major
	};

	const sums = data.audio_features.reduce((acc, curr) => {
		if (!curr) return acc;

		// Update tallies
		tallies.keys[curr.key] += 1;
		tallies.modes[curr.mode] += 1;

		// Update sums
		Object.keys(acc).forEach(feature => {
			acc[feature] += curr[feature];
		});
		return acc;
	}, {
		acousticness: 0,
		danceability: 0,
		duration_ms: 0,
		energy: 0,
		instrumentalness: 0,
		liveness: 0,
		loudness: -60,
		tempo: 0,
		valence: 0
	});

	const featureTallies = {};
	// Get top three keys
	featureTallies.keys = tallies.keys.map((tracks, index) => { 
		return { 
			tracks, 
			tone: getTone(index) 
		}; 
	}).sort((a, b) => b.tracks - a.tracks).slice(0, 3);

	// Get predominant mode
	featureTallies.mode = tallies.modes[0] > tallies.modes[1] ? 'Minor' : 'Major';

	// Calculate average of feature sums
	const featureAverages = {};
	Object.keys(sums).forEach((feature) => {
		featureAverages[feature] = sums[feature] / count;
	});

	// Set the time duration string for convenience purposes
	const durationInSeconds = featureAverages.duration_ms / 1000;
	const durationInMinutes = Math.floor(durationInSeconds / 60);
	let remainingSeconds = Math.round(durationInSeconds % 60);
	remainingSeconds = remainingSeconds < 10 ? '0' + String(remainingSeconds) : String(remainingSeconds); 

	featureAverages.duration_string = `${durationInMinutes}:${remainingSeconds}`;

	return {
		tonality: featureTallies,
		features: featureAverages
	};
};