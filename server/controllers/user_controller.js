const Registration = require('../models/registration');
const Order = require('../models/order');
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
	},
	placeMealOrder(req, res, next) {
		const {
			meal,
			event,
			quantity
		} = req.body;

		const order = new Order({
			user: req.user._id,
			meal,
			event,
			quantity
		});

		order.save()
			.then(ord => res.json(ord))
			.catch(next);
	}
}