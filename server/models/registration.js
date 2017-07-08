const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = require('./order');
const Category = require('./category');
const Meal = require('./meal');

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
		orders: [OrderSchema],
		totalBill: Number,
		paid: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: 'timeRegistered' } }
);

RegistrationSchema.statics.checkStatus = function(user, category, cb) {
	this
		.find({ category, paid: true })
		.exec(function(err, regs) {
			if (err) return cb(err);

			if (regs.length < category.participantLimit 
				&& category.event.open
			) {
				return cb(null, true);
			} else {
				return cb(null, false);
			}

		});
};

RegistrationSchema.pre('save', function(next) {
	var	reg_bill = 0,
			orders_bill = 0

	const registration = this;
	Category.populate(this, { path: 'category' }, function(err, reg) {
		reg_bill += reg.category.price;
		if (registration.orders) {
			Meal.populate(reg, { path: 'orders.meal' }, function(err, reg) {
			reg.orders.map(order => {
					orders_bill += order.meal.price * order.quantity;
				});
				registration.totalBill = reg_bill + orders_bill;
				next();
			});
		} else {
			registration.totalBill = reg_bill;
			next();
		}
	});
});

const Registration = mongoose.model('registration', RegistrationSchema);

module.exports = Registration;