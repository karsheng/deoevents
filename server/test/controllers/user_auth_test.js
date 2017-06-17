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
			Promise.all([
				createCategory(token, '5km'),
				createCategory(token, '10km'),
				createCategory(token, 'half-marathon'),
				createCategory(token, 'full-marathon')
			])
			.then(categories => {
				cat1 = categories[0];
				cat2 = categories[1];
				cat3 = categories[2];
				cat4 = categories[3];
				done();
			});
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
				interests: [cat1._id, cat2._id, cat3._id, cat4._id]
			})
			.end((err, res) => {
				User.findOne({ name: 'Lee Kar Sheng' })
					.populate({ path: 'interests', model: 'category' })
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