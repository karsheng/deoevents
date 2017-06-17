const assert = require('assert');
const request = require('supertest');
const app = require('../../app');

describe('Admin Auth Controller', function(done) {
	var adminToken;

	it('/POST to /admin/create creates an admin', done => {
		request(app)
			.post('/admin/create')
			.send({
				email: 'karshenglee@gmail.com',
				password: 'Admin1!2@3#'
			})
			.end((err, res) => {
				assert(res.body.token);
				done();
			});
	});

	it('/POST to /admin/signin signs in an admin', done => {
		request(app)
			.post('/admin/create')
			.send({
				email: 'karshenglee@gmail.com',
				password: 'Admin1!2@3#'
			})
			.end((err, res) => {
				request(app)
					.post('/admin/signin')
					.send({
						email: 'karshenglee@gmail.com',
						password: 'Admin1!2@3#'
					})
					.end((err, res) => {
						assert(res.body.token);
						done();
					});
			});
	})
});