const request = require('supertest');
const app = require('../app');

module.exports = (email, password) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/signin')
			.send({
				email: email,
				password: password
			})
			.end((err, res) => {	
				resolve(res);
			});
	});
}