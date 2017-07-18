const request = require('supertest');
const app = require('../app');

module.exports = (token, registration, payment_id, payer_id) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/api/paypal/execute-payment/${registration._id}`)
			.set('authorization', token)
			.send({
				payment_id, 
				payer_id
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
}