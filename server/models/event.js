const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	name: String,
	datetime: Date,
	address: String,
	lat: Number,
	lng: Number,
	description: String,
	imageUrl: String,
	categories: [{
		type: Schema.Types.ObjectId,
		ref: 'category'
	}],
	meals: [{
		type: Schema.Types.ObjectId,
		ref: 'meal'
	}],
	open: {
		type: Boolean
	}
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;