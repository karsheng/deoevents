const request = require('supertest');
const app = require('../app');

module.exports = (token, event_id, category) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/event/register/${event_id}`)
			.set('authorization', token)
			.send({
				category
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
}