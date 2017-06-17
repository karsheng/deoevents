const mongoose = require('mongoose');
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
		},
		orders: {
			type: Schema.Types.ObjectId,
			ref: 'orders'
		}
	},
	{ timestamps: { createdAt: 'timeRegistered' } }
);

const Registration = mongoose.model('registration', RegistrationSchema);

module.exports = Registration;