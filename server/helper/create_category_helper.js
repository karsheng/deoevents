const request = require('supertest');
const app  = require('../app');

module.exports = (token, name, price, gender, ageMin, ageMax, participantLimit, event) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/admin/category')
			.set('admin-authorization', token)
			.send({
				name,
				price,
				gender,
				ageMin,
				ageMax,
				participantLimit,
				event
			})
			.end((err, res) => {
				resolve(res.body);
			});
	}); 
}