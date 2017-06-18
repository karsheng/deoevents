const mongoose = require('mongoose');
const Order = require('./order');
const Schema = mongoose.Schema;


const RegistrationSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user'
		},
		event: {
			type: Schema.Types.ObjectId,
			ref: 'event'
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'category'
		},
		orders: [{
			type: Schema.Types.ObjectId,
			ref: 'order'
		}],
		paid: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: 'timeRegistered' } }
);

RegistrationSchema.pre('save', function(next) {
	const registration = this;

	Order.find({ $and: [
		{ user: registration.user }, 
		{ event: registration.event }
	] }, function(err, orders) {
		if (err) return next(err);
		registration.orders = orders;
		next();
	});
});

const Registration = mongoose.model('registration', RegistrationSchema);

module.exports = Registration;