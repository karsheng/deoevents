const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createUser = require('../../helper/create_user_helper');
const signinUser = require('../../helper/user_signin_helper');
const mongoose = require('mongoose');
const User = mongoose.model('user');

describe('User Auth Controller', function(done){
	this.timeout(15000);

	beforeEach(done => {
		createAdmin('karsheng_88@hotmail.com', 'qwerty123')
		.then(token => {
			done();
		});
	});

	it('POST to /signup creates a user', done => {
		this.timeout(15000);
		request(app)
			.post('/signup')
			.send({
				name: 'Lee Kar Sheng',
				email: 'karshenglee@gmail.com',
				password: 'qwerty123',
				gender: true,
				address1: '16, The Breezeway',
				address2: 'Desa Parkcity',
				city: 'Kuala Lumpur',
				postcode: '52200',
				interests: ['5km', '10km', 'Half-marathon', 'Full-marathon']
			})
			.end((err, res) => {
				User.findOne({ name: 'Lee Kar Sheng' })
					.then(user => {
						assert(user.email === 'karshenglee@gmail.com');
						assert(user.interests[0] === '5km');
						done();
					});
			});
	});

	it('POST to /signin signs in a user and return a token', done => {
		request(app)
			.post('/signup')
			.send({
				name: 'Lee Kar Sheng',
				email: 'karsheng_88@hotmail.com',
				password: 'qwerty123',
				gender: true,
				address1: '16, The Breezeway',
				address2: 'Desa Parkcity',
				city: 'Kuala Lumpur',
				postcode: '52200'
			})
			.end((err, res) => {
				request(app)
					.post('/signin')			
					.send({
						email: 'karsheng_88@hotmail.com',
						password: 'qwerty123'
					})
					.end((err, res) => {
						assert(res.body.token);
						done();
					});
			});
	});

	it('PUT to /user/email updates the user email', done => {
		createUser(
			'Gavin Belson',
			'gavin@hooli.com',
			'qwerty123',
			true,
			'100 Hooli Road',
			'Silicon Valley',
			'Palo Alto',
			'San Francisco',
			45720,
			'U.S.',
			['5km', '10km', 'Half-marathon', 'Full-marathon']
		)
		.then(token => {
			request(app)
				.put('/user/email')
				.set('authorization', token)
				.send({ email: 'gavin@gmail.com'})
				.end((err, res) => {
					User.findById(res.body._id)
						.then(user => {
							assert(user.name === 'Gavin Belson');
							assert(user.email === 'gavin@gmail.com');
							done();
						});
				});
		});
	});

	it('POST to /user/password/change changes the user password', done => {
		createUser(
			'Gavin Belson',
			'gavin@hooli.com',
			'qwerty123',
			true,
			'100 Hooli Road',
			'Silicon Valley',
			'Palo Alto',
			'San Francisco',
			45720,
			'U.S.',
			['5km', '10km', 'Half-marathon', 'Full-marathon']
		)
		.then(token => {
			request(app)
				.post('/user/password/change')
				.set('authorization', token)
				.send({
					oldPassword: 'qwerty123',
					newPassword: 'hellothere123',
					confirmPassword: 'hellothere123'
				})
				.end((err, res) => {
					request(app)
						.post('/signin')
						.send({
							email: 'gavin@hooli.com',
							password: 'hellothere123'
						})
						.end((err, res) => {
							assert(res.body.token);
							done();
						});
				});
		});
	});

	it('GET to /profile returns profile of the user', done => {
		createUser(
			'Gavin Belson',
			'gavin@hooli.com',
			'qwerty123',
			true,
			'100 Hooli Road',
			'Silicon Valley',
			'Palo Alto',
			'San Francisco',
			45720,
			'U.S.',
			['5km', '10km', 'Half-marathon', 'Full-marathon']
		)
		.then(token => {
			request(app)
				.get('/profile')
				.set('authorization', token)
				.end((err, res) => {
					assert(res.body.name === 'Gavin Belson');
					assert(res.body.password === undefined);
					assert(res.body.isAdmin === undefined);
					assert(res.body.loginAttempts === undefined);
					assert(res.body.interests[0] === '5km');
					done();
				});
		});
	});

	it('PUT to /profile updates the profile of the user', done => {
		createUser(
			'Gavin Belson',
			'gavin@hooli.com',
			'qwerty123',
			true,
			'100 Hooli Road',
			'Silicon Valley',
			'Palo Alto',
			'San Francisco',
			45720,
			'U.S.',
			['5km', '10km', 'Half-marathon', 'Full-marathon']
		)
		.then(token => {
			request(app)
				.put('/profile')
				.set('authorization', token)
				.send({
					name: 'Gavin Smelson',
					email: 'gavin@hooli.com',
					gender: false,
					address1: '200 Belson Road',
					address2: 'Silicon Valley',
					address3: 'Palo Alto',
					city: 'San Franscisco',
					postcode: 13576,
					country: 'U.S.',
					interests: ['Half-marathon', 'Full-marathon']
				})
				.end((err, res) => {
					User.findOne({ name: 'Gavin Smelson'})
						.then(user => {
							assert(res.body.password === undefined);
							assert(user.email === 'gavin@hooli.com');
							assert(user.address1 === '200 Belson Road');
							assert(user.postcode === '13576');
							done();	
						});
				});
		});
	});

	it('Failed login more than five times locks the account for two hours', done => {
		createUser(
			'Gavin Belson',
			'gavin@hooli.com',
			'qwerty123',
			true,
			'100 Hooli Road',
			'Silicon Valley',
			'Palo Alto',
			'San Francisco',
			45720,
			'U.S.',
			['5km', '10km', 'Half-marathon', 'Full-marathon']
		)
		.then(_ => {
			signinUser('gavin@hooli.com', 'qwerty123')
			.then(res => {
				assert(res.body.token);
				signinUser('gavin@hooli.com', 'wrongpassword')
				.then(_ => {
					signinUser('gavin@hooli.com', 'wrongpassword')
						.then(_ => {
							signinUser('gavin@hooli.com', 'wrongpassword')
							.then(_ => {
								signinUser('gavin@hooli.com', 'wrongpassword')
								.then(res => {
									signinUser('gavin@hooli.com', 'wrongpassword')
									.then(res => {
										signinUser('gavin@hooli.com', 'qwerty123')
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