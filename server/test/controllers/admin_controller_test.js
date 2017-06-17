const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const Category = mongoose.model('category');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const faker = require('faker');
const Event = mongoose.model('event');

describe('Admin Controller', function(done) {
	this.timeout(15000);
	var adminToken;
	var cat1, cat2, cat3, cat4;

	beforeEach(done => {
		createAdmin('karshenglee@gmail.com', 'qwerty123')
		.then(token => {
			adminToken = token;
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

	it('/POST to /admin/category creates a new category', done => {
		request(app)
			.post('/admin/category')
			.set('admin-authorization', adminToken)
			.send({ name: '10km' })
			.end((err, res) => {
				Category.findOne({ name: '10km' })
					.then(cat => {
						assert(cat.name === '10km');
						done();
					});
			});
	});

	it('/POST to /admin/event creates a new event', done => {
		request(app)
			.post('/admin/event')
			.set('admin-authorization', adminToken)
			.send({
				name: 'Event 1',
				datetime: new Date().getTime(),
				address: 'Desa Parkcity',
				lat: 3.1862,
				lng: 101.6299,
				description: faker.lorem.paragraph(),
				imageUrl: faker.image.imageUrl(),
				categories: [cat1, cat2, cat3, cat4]
			})
			.end((err, res) => {
				Event.findOne({ name: 'Event 1'})
					.then(event => {
						assert(event.name === 'Event 1');
						assert(event.address === 'Desa Parkcity');
						assert(event.lat === 3.1862);
						done();
					});
			});
	});
});