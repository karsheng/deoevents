const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InterestSchema = new Schema({
	name: String
});

const Interest = mongoose.model('interest', InterestSchema);

module.exports = Interest;