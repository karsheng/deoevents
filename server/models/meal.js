const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealSchema = new Schema({
	name: String,
	price: Number,
	description: String,
	imageUrl: String
});

const Meal = mongoose.model('meal', MealSchema);

module.exports = Meal;