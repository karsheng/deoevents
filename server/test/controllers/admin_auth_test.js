const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const signinAdmin = require('../../helper/admin_signin_helper');

describe('Admin Auth Controller', function(done) {
	this.timeout(20000);
	var adminToken;

	it('/POST to /api/admin/create creates an admin', done => {
		request(app)
			.post('/api/admin/create')
			.send({
				email: 'karshenglee@gmail.com',
				password: 'Admin1!2@3#'
			})
			.end((err, res) => {
				assert(res.body.token);
				done();
			});
	});

	it('/POST to /api/admin/signin signs in an admin', done => {
		request(app)
			.post('/api/admin/create')
			.send({
				email: 'karshenglee@gmail.com',
				password: 'Admin1!2@3#'
			})
			.end((err, res) => {
				request(app)
					.post('/api/admin/signin')
					.send({
						email: 'karshenglee@gmail.com',
						password: 'Admin1!2@3#'
					})
					.end((err, res) => {
						assert(res.body.token);
						done();
					});
			});
	});

it('Failed login more than five times locks the admin account for two hours', done => {
		createAdmin(
			'admin@deo.com',
			'qwerty123'
		)
		.then(_ => {
			signinAdmin('admin@deo.com', 'qwerty123')
			.then(res => {
				assert(res.body.token);
				signinAdmin('admin@deo.com', 'wrongpassword')
				.then(_ => {
					signinAdmin('admin@deo.com', 'wrongpassword')
					.then(_ => {
						signinAdmin('admin@deo.com', 'wrongpassword')
						.then(_ => {
							signinAdmin('admin@deo.com', 'wrongpassword')
							.then(res => {
								signinAdmin('admin@deo.com', 'wrongpassword')
								.then(res => {
									signinAdmin('admin@deo.com', 'qwerty123')
									.then(res => {
										assert(res.body.token === undefined);
										done();
									});
								});
							});
						});
					});
				});
			});
		});
	});

});