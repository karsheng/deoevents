const request = require('supertest');
const app = require('../app');

module.exports = (token, meal, registration, quantity) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/meal/order/${registration._id}`)
			.set('authorization', token)
			.send({
				meal,
				quantity
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
}