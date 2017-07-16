const Registration = require('../models/registration');
const Category = require('../models/category');

function checkRegistrationEligibity(user, category, next, cb) {
	Category.findById(category._id)
		.populate({ path: 'event', model: 'event' })
		.then(category => {
			Registration.checkStatus(user, category, function(err, isOpen) {
				if (err) return next(err);
				if (isOpen) {
					category.checkEligibility(user, function(isEligible) {
						if (isEligible) return cb(null, true);
						return cb({ message: 'You cannot register for this category' }, false);
					});
				} else {
					return cb({ message: 'Registration for this category is closed' }, false);
				}
			});
		})
		.catch(next);
}

module.exports = {
	getRegistrationInfo(req, res, next) {
		const { event_id } = req.params;
		const { user } = req;

		Registration
		.findOne({ event: event_id, user })
		.populate({ path: 'category', model: 'category' })
		.populate({ path: 'orders.meal', model: 'meal' })
		.populate({ path: 'event', model: 'event' })
		.then(reg => {
			res.json(reg);
		})
		.catch(next);
	},
	registerForEvent(req, res, next) {
		const { event_id } = req.params;
		const { user } = req;
		const { category, orders } = req.body;

		checkRegistrationEligibity(user, category, next, function(errMessage, isEligible) {
			if (isEligible) {
				// check if user already registered
				Registration.findOne({
					user,
					event: event_id,
				})
				.then(existingReg => {
					// if user not registered, create new registration
					if (!existingReg) {
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
						// if user registered, update existing registration
						if (existingReg.paid) return res.status(422).send({ message: 'User already registered' });
						existingReg.category = category;
						existingReg.orders = orders;

						existingReg.save()
							.then(reg => res.json(reg))
							.catch(next);
					}
				})
				.catch(next);
			} else {
				res.status(422).send(errMessage);
			}
		});
	}
}