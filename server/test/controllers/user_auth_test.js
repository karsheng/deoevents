const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const mongoose = require('mongoose');
const User = mongoose.model('user');

describe('User Auth Controller', function(done){
	var cat1, cat2, cat3, cat4;

	this.timeout(15000);

	beforeEach(done => {
		createAdmin('karsheng_88@hotmail.com', 'qwerty123')
		.then(token => {
			cat1 = createCategory('5km', null);
			cat2 = createCategory('10km', null);
			cat3 = createCategory('half-marathon', null);
			cat4 = createCategory('full-marathon', null);
			done();
		});
	});

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
				interests: [cat1, cat2, cat3, cat4]
			})
			.end((err, res) => {
				User.findOne({ name: 'Lee Kar Sheng' })
					.then(user => {
						assert(user.email === 'karshenglee@gmail.com');
						assert(user.interests[0].name === '5km');
						done();
					});
			});
	});

	it('/POST to /signin signs in a user and return a token', done => {
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
});