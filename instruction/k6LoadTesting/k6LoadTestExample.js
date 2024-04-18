import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
	stages: [
		// Ramp up over 1 minute to 50 users
		{ duration: '1m', target: 50 },
		// Ramp up over 2 minutes to 100 users
		{ duration: '2m', target: 100 },
		// Ramp down over 1 minute to 0 users
		{ duration: '1m', target: 0 },
	],
	ext: {
		loadimpact: {
			// Project: Default project
			projectID: 3690099,
			// Test runs with the same name groups test runs together.
			name: 'Test for learning k6',
		},
	},
};

export default function () {
	http.get('https://test.k6.io');
	sleep(1);
}
