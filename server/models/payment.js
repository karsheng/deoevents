const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Registration = require('./registration');
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

const Payment = mongoose.model('payment', PaymentSchema);

module.exports = Payment;