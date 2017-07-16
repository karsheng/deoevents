// to be deleted after integration of payment system

const Registration = require('../models/registration');
const Payment = require('../models/payment');

module.exports = {
	executeFakePayment(req, res, next) {
		const { registration_id } = req.params;
		const { user } = req;

		Registration.findById(registration_id)
			.populate({ path: 'category', model: 'category' })
			.populate({ path: 'orders.meal', model: 'meal' })
			.then(reg => {
				if (reg) {
					const payment = new Payment({
						user: user._id,
						registration: reg._id,
						amount: reg.totalBill,
						currency: 'MYR'
					});

					payment.save()
						.then(p => res.send(p))
						.catch(next);
				}
			});
	}
};