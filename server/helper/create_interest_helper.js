const request = require('supertest');
const app  = require('../app');

module.exports = (token, name) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/admin/interest')
			.set('admin-authorization', token)
			.send({
				name
			})
			.end((err, res) => {
				resolve(res.body);
			});
	}); 
}