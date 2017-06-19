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
			{ event : event_id },
			{ category },
			{ new: true }			
		)
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