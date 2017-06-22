const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssociateSchema = new Schema({
	name: String,
	logo: String,
	imageUrl: String,
	address1: { type: String },
	address2: { type: String },
	address3: { type: String },
	city: { type: String },
	postcode: { type: String },
	country: { type: String },
	description: { type: String }
});

const Associate = mongoose.model('associate', AssociateSchema);

module.exports = Associate;