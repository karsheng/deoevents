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

RegistrationSchema.statics.getTotalBill = function(registration_id, user, cb) {
	var	reg_bill = 0,
			orders_bill = 0

	this.
		findOne({
			_id: registration_id,
			user
		})
		.populate({ path: 'category', model: 'category' })
		.exec(function(err, reg) {
			if (err) return cb(err);

			if (reg) { reg_bill = reg.category.price; }
			
			Order.find({
				registration: registration_id,
				user
			})
			.populate({ path: 'meal', model: 'meal' })
			.exec(function(err, orders) {
				if (err) return cb(err);

				orders_bill = orders.reduce(function(total, order) {
					return total + order.meal.price * order.quantity;
				}, 0);
				
				const total_bill = reg_bill + orders_bill
				
				return cb(null, total_bill);
			});
		});	
};

const Registration = mongoose.model('registration', RegistrationSchema);

module.exports = Registration;