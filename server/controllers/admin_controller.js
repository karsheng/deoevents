const Event = require('../models/event');
const Meal = require('../models/meal');
const Associate = require('../models/associate');

module.exports = {
	createEvent(req, res, next) {
		const { 
			name,
			datetime,
			address,
			lat,
			lng,
			description,
			imageUrl,
			categories,
			meals,
			open
		} = req.body;

		const event = new Event({
			name,
			datetime,
			address,
			lat,
			lng,
			description,
			imageUrl,
			categories,
			meals,
			open
		});

		event.save()
			.then(e => res.json(e))
			.catch(next);
	},
	updateEvent(req, res, next) {
		const { event_id } = req.params;

		const { 
			name,
			datetime,
			address,
			lat,
			lng,
			description,
			imageUrl,
			categories,
			meals,
			open
		} = req.body;

		Event.findByIdAndUpdate(event_id, 
			{
				name,
				datetime,
				address,
				lat,
				lng,
				description,
				imageUrl,
				categories,
				meals,
				open
			},
			{
				new: true
			}
		)
		.then(returnedEvent => {
			res.json(returnedEvent);
		})
		.catch(next);
	},
	deleteEvent(req, res, next) {
		const { event_id } = req.params;
		
		Event.findByIdAndRemove(event_id)
			.then(removedEvent => res.send(removedEvent))
			.catch(next);
	},
	createMeal(req, res, next) {
		const { name, price, description, imageUrl } = req.body;

		const meal = new Meal({
			name,
			price,
			description,
			imageUrl
		});

		meal.save()
		.then(m => res.json(m))
		.catch(next);
	},
	getMeal(req, res, next) {
		const { meal_id } = req.params;

		Meal.findById(meal_id)
			.then(meal => res.json(meal))
			.catch(next);
	},
	getAllMeals(req, res, next) {
		Meal.find({})
			.then(meals => res.json(meals))
			.catch(next);
	},
	deleteMeal(req, res, next) {
		const { meal_id } = req.params;

		Meal.findByIdAndRemove(meal_id)
			.then(meal => res.json(meal))
			.catch(next);
	},
	createAssociate(req, res, next) {
		const {
			name,
			logo,
			imageUrl,
			address1,
			address2,
			address3,
			city,
			postcode,
			country,
			description
		} = req.body;

		const associate = new Associate({
			name,
			logo,
			imageUrl,
			address1,
			address2,
			address3,
			city,
			postcode,
			country,
			description
		});

		associate.save()
			.then(asso => res.json(asso))
			.catch(next);
	},
	updateAssociate(req, res, next) {
		const {
			name,
			logo,
			imageUrl,
			address1,
			address2,
			address3,
			city,
			postcode,
			country,
			description
		} = req.body;

		const { associate_id } = req.params;

		Associate.findByIdAndUpdate(
			associate_id,
			{
				name,
				logo,
				imageUrl,
				address1,
				address2,
				address3,
				city,
				postcode,
				country,
				description
			},
			{ new: true }
		)
			.then(asso => res.json(asso))
			.catch(next);
	},
	deleteAssociate(req, res, next) {
		const { associate_id } = req.params;

		Associate.findByIdAndRemove(associate_id)
			.then(asso => res.json(asso))
			.catch(next);
	}
};