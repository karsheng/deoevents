const Registration = require('../models/registration');
const Payment = require('../models/payment');
const paypal = require('paypal-rest-sdk');
const config = require('../config');

paypal.configure({
	mode: 'sandbox',
	client_id: config.paypal_client_id,
	client_secret: config.paypal_client_secret
});

paypal.createPayment = (total_bill, cb) => {
	return cb({
		id: 'PAY-123ABC456DEF789',
		intent: 'sale',
		state: 'created',
		total_bill
	});
};

// simulate PayPal RESTful API response for executing payment
paypal.executePayment = (total_bill, cb) => {
	return cb({
		id: 'PAY-123ABC456DEF789',
		state: 'approved',
		transactions: [
			{
				amount: 
				{
					total: total_bill,
					currency: 'MYR'
				}
			}
		]
	});
};

module.exports = {
	createPayment(req, res, next) {
		const { registration_id } = req.params;

		Registration.getTotalBill(registration_id, req.user, function(err, total_bill) {
			if (err) return next(err);
			// TO DELETE: simulate create payment with PayPal
			paypal.createPayment(total_bill, function(paypalRes) {
				res.send({
					paymentID: paypalRes.id,
					total_bill: paypalRes.total_bill
				});
			});
		});
	},
	executePayment(req, res, next) {
		const { registration_id } = req.params;
		const { payment_id, payer_id } = req.body;

		// TO DELETE: this method is used to get price
		// to be removed when integrated PayPal payment system
		Registration.getTotalBill(registration_id, req.user, function(err, total_bill) {
			if (err) return next(err);

			paypal.executePayment(total_bill, function(paypalRes) {
				if (paypalRes.state === 'approved') {
					const payment = new Payment({
						user: req.user._id,
						registration: registration_id,
						amount: paypalRes.transactions[0].amount.total,
						currency: paypalRes.transactions[0].amount.currency,
						paypalPaymentId: paypalRes.id
					});

					payment.save()
						.then(p => res.send(p))
						.catch(next);
				}
			});
		});
	}
};