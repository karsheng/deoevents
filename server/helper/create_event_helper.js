const request = require('supertest');
const app = require('../app');


module.exports = (token, name, datetime, address, lat, lng, description, imageUrl, categories) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/admin/event')
			.set('admin-authorization', token)
			.send({
				name,
				datetime,
				address,
				lat,
				lng,
				description,
				imageUrl,
				categories
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
}