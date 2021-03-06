const request = require('supertest');
const app = require('../app');

module.exports = (email, password) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/api/admin/signin')
			.send({
				email: email,
				password: password
			})
			.end((err, res) => {	
				resolve(res);
			});
	});
}