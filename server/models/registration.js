const mongoose = require('mongoose');
const Order = require('./order');
const Schema = mongoose.Schema;
const CategorySchema = require('./category');

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
		category: CategorySchema,
		paid: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: 'timeRegistered' } }
);

const Registration = mongoose.model('registration', RegistrationSchema);

module.exports = Registration;