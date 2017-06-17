const request = require('supertest');
const app = require('../app');


module.exports = (name, email, password, gender, address1, address2, address3, city, postcode, country, interests) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post('/signup')
			.send({
				name,
				email,
				password,
				gender,
				address1,
				address2,
				address3,
				city,
				postcode,
				country,
				interests
			})
			.end((err, res) => {
				resolve(res.body.token);
			});
	});
}