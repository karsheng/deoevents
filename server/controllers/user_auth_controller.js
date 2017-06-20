const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');


function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

module.exports = {
	signin(req, res, next) {
		// User has already had their email and password auth'd
		// We just need to give them a token
		res.send({ token: tokenForUser(req.user) }); 
	},
	signup(req, res, next) {
		const {
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
		} = req.body;

		if (!email || !password) {
			return res.status(422).send({ error: 'You must provide email and password' })
		}

		// TODO: email and password validation

		// see if a user with a given email exists
		User.findOne({ email: email }, function(err, existingUser) {
			if (err) { return next(err); }

			// if a user with email does exist, return an error
			if (existingUser) {
				return res.status(422).send({ error: 'Email is in use' }); //unprocessable entity
			}

			// if a user with email does not exit, create and save user record
			const user = new User({
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
			});

			user.save(function(err) {
				if (err) { return next(err); }

			// respond to request indicating the user was created		
			res.json({ token: tokenForUser(user) });
			});
		});
	},
	updateProfile(req, res, next) {
		const {
			name, 
			gender,
			address1,
			address2,
			address3,
			city,
			postcode,
			country,
			interests
		} = req.body;

		User.findByIdAndUpdate(
			req.user._id,
			{
				name, 
				gender,
				address1,
				address2,
				address3,
				city,
				postcode,
				country,
				interests
			},
			{ new: true }
		)
		.select('name gender address1 address2 address3 city postcode country interests')
		.then(user => {
			res.json(user);
		})
		.catch(next);
	}
};