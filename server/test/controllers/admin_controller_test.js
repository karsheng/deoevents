const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const Category = mongoose.model('category');
const createAdmin = require('../../helper/create_admin_helper');

describe('Admin Controller', function(done) {
	this.timeout(15000);
	var adminToken;

	beforeEach(done => {
		createAdmin('karshenglee@gmail.com', 'qwerty123')
			.then(token => {
				adminToken = token;
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