const request = require('supertest');
const app = require('../app');

module.exports = (token, registration) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/paypal/create-payment/${registration._id}`)
			.set('authorization', token)
			.end((err, res) => {
				resolve(res.body);
			});
	});
}