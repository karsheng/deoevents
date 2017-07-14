const Registration = require('../models/registration');
const Payment = require('../models/payment');
const paypal = require('paypal-rest-sdk');
const config = require('../config');

paypal.configure({
	mode: 'sandbox',
	client_id: config.paypal_client_id,
	client_secret: config.paypal_client_secret
});

module.exports = {
	createPayment(req, res, next) {
		const { registration_id } = req.params;
		const { user } = req;

		Registration.findById(registration_id)
		.populate({ path: 'category', model: 'category' })
		.populate({ path: 'orders.meal', model: 'meal' })
		.then(reg => {
			if (reg) {
				const categoryItem = [{
					name: reg.category.name,
					sku: reg.category.name,
					price: reg.category.price,
					currency: 'MYR',
					quantity: 1
				}];
				const ordersItems = reg.orders.map(order => {
					return {
						name: order.meal.name,
						sku: order.meal.name,
						price: order.meal.price,
						currency: 'MYR',
						quantity: order.quantity
					}
				});

				const create_payment_json = {
					intent: 'sale',
					payer: {
						payment_method: 'paypal'
					},
					redirect_urls: {
						return_url: 'http://localhost:8080/',
						cancel_url: 'http://localhost:8080/'
					},
					transactions: [{
						item_list: {
							items: [...categoryItem, ...ordersItems]
						},
						amount: {
							currency: 'MYR',
							total: reg.totalBill
						}
					}]
				};

				paypal.payment.create(create_payment_json, function(err, payment) {
					if (err) { 
						next(err); 
					} else {
						res.send(payment);
					}

				})
			} else {
				return res.status(422).send({error: 'Registration not found'});
			}
		})
		.catch(next);

	},
	executePayment(req, res, next) {
		const { registration_id } = req.params;
		const { paymentID, payerID } = req.body;

		const execute_payment_json = {
			payer_id: payerID
		}

		paypal.payment.execute(paymentID, execute_payment_json, function(err, paypalResponse) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				console.log(paypalResponse);
				if (paypalResponse.state === 'approved') {
					const payment = new Payment({
						user: req.user._id,
						registration: registration_id,
						amount: paypalResponse.transactions[0].amount.total,
						currency: paypalResponse.transactions[0].amount.currency,
						paypalPaymentId: paypalResponse.id
					});

					payment.save()
						.then(p => res.send(p))
						.catch(next);
				} else {
					res.status(422).send({ error: 'Payment not approved' });
				}
			}
		});
	}
};