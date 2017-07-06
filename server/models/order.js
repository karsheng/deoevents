const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	meal: {
		type: Schema.Types.ObjectId,
		ref: 'meal'
	},
	quantity: {
		type: Number
	}
});

module.exports = OrderSchema;