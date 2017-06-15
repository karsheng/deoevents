const assert = require('assert');
const request = require('supertest');
const app = require('../../app');

describe('User Auth Controller', function(done){

	it('/POST to /signup creates a user', done => {
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
				interests: ['10k', 'half', 'full']
			})
			.end((err, res) => {
				assert(res.body.token);
				done();		
			});
	});

	it('/POST to /signin signs in a user and return a token', done => {
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
				interests: ['10k', 'half', 'full']
			})
			.end((err, res) => {
				request(app)
					.post('/signin')			
					.send({
						email: 'karshenglee@gmail.com',
						password: 'qwerty123'
					})
					.end((err, res) => {
						assert(res.body.token);
						done();
					});
			});
	});
});