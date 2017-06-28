const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Registration = require('./registration');
const Order = require('./order');
const User = require('./user');

const PaymentSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user'
		},
		registration: {
			type: Schema.Types.ObjectId,
			ref: 'registration'
		},
		orders: [{
			type: Schema.Types.ObjectId,
			ref: 'order'
		}],
		amount: Number,
		currency: String,
		paypalPaymentId: String
	},
	{ timestamps: { createdAt: 'timePaid' } }
);

PaymentSchema.pre('save', function(next) {
	const payment = this;

	Registration
		.findByIdAndUpdate(
			payment.registration,
			{ paid: true }
		)
		.exec(function(err, registration) {
			if (err) { return next(err); }

			Order.update(
				{ registration: payment.registration },
				{ $set: { paid: true } },
				{ multi: true , new: true }
			)
			.exec(function(err) {
				if (err) { return next(err); }
				Order
					.find({ registration: payment.registration })
					.exec(function(err, orders) {
						if (err) { return next(err); }
						payment.orders = orders;

						User
							.findById(payment.user)
							.exec(function(err, user) {
								if (err) { return next(err); }
								user.registrations.push(payment.registration);
								user.save()
									.then(_ => {
										next();
									})
									.catch(next)
							});
					});
			});
		});
});

const Payment = mongoose.model('payment', PaymentSchema);

module.exports = Payment;