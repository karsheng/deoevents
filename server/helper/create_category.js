const request = require('supertest');
const app = require('../app');

module.exports = (adminToken, category) => {
	request(app)
		.post('/admin/category')
		.set('admin-authorization', adminToken)
		.send({ name: category })
		.end((err, res) => {
			resolve(res.body);
		});
}