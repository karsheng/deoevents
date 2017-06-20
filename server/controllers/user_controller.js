const Registration = require('../models/registration');
const Order = require('../models/order');
module.exports = {
	registerForEvent(req, res, next) {
		const { event_id } = req.params;
		const { category } = req.body;

		const registration = new Registration({
			user: req.user._id,
			event: event_id,
			category
		});

		registration.save()
			.then(reg => res.json(reg))
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
	updateMealOrder(req, res, next) {
		const { quantity } = req.body;
		const { order_id } = req.params;

		Order.findByIdAndUpdate(
			order_id,
			{ quantity }
		)
			.then(order => res.json(order))
			.catch(next);
	}
}