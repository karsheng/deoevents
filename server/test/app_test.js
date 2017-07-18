const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('The express app', () => {
	it('GET to /api/test returns test success string', (done) => {
		request(app)
			.get('/api/test')
			.end((err, res) => {
				assert(res.text === 'test success!');
				done();
			}); 
	});
});