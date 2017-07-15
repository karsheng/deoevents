const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CollectionSchema = require('./collection');

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
	},
	collectionInfo: [CollectionSchema],
	resultUrl: String
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;