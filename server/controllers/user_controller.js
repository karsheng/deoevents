const Registration = require('../models/registration');
const Order = require('../models/order');
const Category = require('../models/category');

module.exports = {
	registerForEvent(req, res, next) {
		const { event_id } = req.params;
		const { category } = req.body;

		Category.findById(category)
		.then(cat => {
			cat.checkAge(req.user.dateOfBirth, function(ageIsValid) {
				if (ageIsValid) {
					const registration = new Registration({
						user: req.user._id,
						event: event_id,
						category
					});

					registration.save()
						.then(reg => res.json(reg))
						.catch(next);
				} else {
					res.status(422).send({ error: 'You cannot register for this category' })
				}

			});
		})
		.catch(next);
	},
	getRegistrationInfo(req, res, next) {
		const { registration_id } = req.params;

		Registration.findById(registration_id)
			.populate({ path: 'event', model: 'event' })
			.populate({ path: 'category', model: 'category' })
			.then(reg => {
				if (reg.user.toString() !== req.user._id.toString()) {
					return res.status(403).send({ error: 'You are not allowed here...'})
				}
				res.json(reg);
			})
			.catch(next);
	},
	updateRegistration(req, res, next) {
		const { event_id } = req.params;
		const { category } = req.body;

		Registration.findOneAndUpdate(
			{ event : event_id, user: req.user._id },
			{ category },
			{ new: true }			
		)
		.then(reg => res.json(reg))
		.catch(next);

	},
	deleteRegistration(req, res, next) {
		const { event_id } = req.params;

		Registration.findOneAndRemove({ 
			event: event_id, 
			user: req.user._id
		})
		.then(reg => res.send(reg))
		.catch(next);
	},
	placeMealOrder(req, res, next) {
		const { registration_id } = req.params;
		const {
			meal,
			quantity
		} = req.body;

		const order = new Order({
			user: req.user._id,
			meal,
			registration: registration_id,
			quantity
		});

		order.save()
			.then(ord => res.json(ord))
			.catch(next);
	},
	getMealOrder(req, res, next) {
		const { order_id } = req.params;

		Order.findById(order_id)
			.populate({ path: 'meal', model: 'meal' })
			.then(order => {
				if (order.user.toString() !== req.user._id.toString()) {
					return res.status(403).send({ error: 'You are not allowed here...'})
				}
				res.json(order);
			})
			.catch(next);
	},
	updateMealOrder(req, res, next) {
		const { quantity } = req.body;
		const { order_id } = req.params;

		Order.findByIdAndUpdate(
			order_id,
			{ quantity }
		)
			.then(order => res.json(order))
			.catch(next);
	},
	deleteMealOrder(req, res, next) {
		const { order_id } = req.params;

		Order.findByIdAndRemove(order_id)
			.then(removedOrder => res.json(removedOrder))
			.catch(next);
	}
}