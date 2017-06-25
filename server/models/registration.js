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

const Registration = mongoose.model('registration', RegistrationSchema);

module.exports = Registration;