const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const Category = mongoose.model('category');

describe('Admin Controller', function(done) {
	this.timeout(15000);
	var adminToken;

	beforeEach(done => {
		request(app)
			.post('/admin/create')
			.send({
				email: 'karshenglee@gmail.com',
				password: 'qwerty123'
			})
			.end((err, res) => {
				adminToken = res.body.token;
				done();
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
});