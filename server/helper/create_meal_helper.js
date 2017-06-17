const request = require('supertest');
const app = require('../app');

module.exports = (token, name, price, description, imageUrl) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/admin/meal')
			.set('admin-authorization', token)
			.send({
				name,
				price,
				description,
				imageUrl
			})
			.end((err, res) => {	
				resolve(res.body);
			});
	});
}