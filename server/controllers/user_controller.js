const Registration = require('../models/registration');

module.exports = {
	registerForEvent(req, res, next) {
		const {
			event,
			category,
			orders
		} = req.body;

		const registration = new Registration({
			user: req.user._id,
			event,
			category,
			orders
		});

		registration.save()
			.then(reg => res.json(reg))
			.catch(next);
	}
}