const request = require('supertest');
const app = require('../app');


module.exports = (token, name, datetime, address, lat, lng, description, imageUrl, categories, meals) => {
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
				categories,
				meals
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
}