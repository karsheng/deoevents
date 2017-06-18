const request = require('supertest');
const app = require('../app');

module.exports = (token, meal, event, quantity) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/meal/order')
			.set('authorization', token)
			.send({
				meal,
				event,
				quantity
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
}