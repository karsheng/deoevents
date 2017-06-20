const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = require('./category');

const EventSchema = new Schema({
	name: String,
	datetime: Date,
	address: String,
	lat: Number,
	lng: Number,
	description: String,
	imageUrl: String,
	categories: [CategorySchema],
	meals: [{
		type: Schema.Types.ObjectId,
		ref: 'meal'
	}]
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;