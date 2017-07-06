const Registration = require('../models/registration');
const Category = require('../models/category');

module.exports = {
	registerForEvent(req, res, next) {
		const { event_id } = req.params;
		const { user } = req;
		const { category, orders } = req.body;

		// check if user already registered
		Registration.findOne({
			user,
			event: event_id,
		})
		.then(result => {
			if (!result) {
				Category.findById(category._id)
					.populate({ path: 'event', model: 'event' })
					.then(category => {
						// checks if category is still open for registration
						Registration.checkStatus(user, category, function(err, isOpen) {
							if (err) return next(err);
							if (isOpen) {
								// check if user is eligible for the category - age and gender
								category.checkEligibility(user, function(isEligible) {
									if (isEligible) {
										const registration = new Registration({
											user: req.user._id,
											event: event_id,
											category,
											orders
										});

										registration.save()
											.then(reg => res.json(reg))
											.catch(next);
									} else {
										res.status(422).send({ message: 'You cannot register for this category' });
									}
								});
							} else {
								res.status(422).send({ message: 'Registration for this category is closed'});
							}
						});
					})
					.catch(next);
			} else {
				res.status(422).send({ message: 'User already registered' });
			}
		})
		.catch(next);
	}
}