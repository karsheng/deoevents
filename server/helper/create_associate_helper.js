const request = require('supertest');
const app = require('../app');

module.exports = (token, name, logo, imageUrl, address1, address2, address3, city, postcode, country, description) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/api/admin/associate')
			.set('admin-authorization', token)
			.send({
				name,
				logo,
				imageUrl,
				address1,
				address2,
				address3,
				city,
				postcode,
				country,
				description
			})
			.end((err, res) => {	
				resolve(res.body);
			});
	});
}