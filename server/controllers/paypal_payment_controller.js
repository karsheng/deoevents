const Registration = require('../models/registration');
const Order = require('../models/order');

// mimic PayPal API response
const PayPal = (total_bill) => {
	return {
		id: 'PAY-123ABC456DEF789',
		intent: 'sale',
		state: 'created',
		total_bill
	};
};

module.exports = {
	createPayment(req, res, next) {

		const { registration_id } = req.params;

		Registration.getTotalBill(registration_id, req.user, function(err, total_bill) {
			if (err) return next(err);
			// TO DELETE: simulate create payment with PayPal
			const resFromPayPal = PayPal(total_bill);

			// TO DELETE: total_bill
			res.send({
				paymentID: resFromPayPal.id,
				total_bill
			});
		});

	},
	executePayment(req, res, next) {
	}
};