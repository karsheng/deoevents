const request = require('supertest');
const app = require('../app');

module.exports = (token, event_id, category, orders) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/event/register/${event_id}`)
			.send({
				category,
				orders
			})
			.set('authorization', token)
			.end((err, res) => {
				resolve(res.body);
			});
	});
}