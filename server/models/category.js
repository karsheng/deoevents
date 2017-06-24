const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: { type: String },
	price: { type: Number },
	gender: { type: Boolean },
	ageMin: { type: Number },
	ageMax: { type: Number },
	participantLimit: { type: Number },
	event: { 
		type: Schema.Types.ObjectId,
		ref: 'event'
	}
});

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;