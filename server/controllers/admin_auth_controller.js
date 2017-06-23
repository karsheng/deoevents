const User = require('../models/user');
const config = require('../config');
const jwt = require('jwt-simple');


function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

module.exports = {
	createAdmin(req, res, next) {
		const { email, password } = req.body;

		const admin = new User({
			email,
			password,
			isAdmin: true
		});
		admin.save(function(err) {
				if (err) { return next(err); }
				res.json({ token: tokenForUser(admin) });
			});
	},
	signin(req, res, next) {
		res.send({ token: tokenForUser(req.user) }); 
	}
};