const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
	address: String,
	time: String,
	description: String
});

module.exports = CollectionSchema;