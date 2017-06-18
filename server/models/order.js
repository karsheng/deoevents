const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	meal: {
		type: Schema.Types.ObjectId,
		ref: 'meal'
	},
	event: {
		type: Schema.Types.ObjectId,
		ref: 'event'
	},
	quantity: {
		type: Number
	},
	paid: {
		type: Boolean,
		default: false
	}
});

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;