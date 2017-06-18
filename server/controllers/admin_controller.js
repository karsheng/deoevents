const Category = require('../models/category');
const Event = require('../models/event');
const Meal = require('../models/meal');

module.exports = {
	createCategory(req, res, next) {
		if (!req.user.admin) {
			return res.status(403).send({ error: 'You are not allowed to do that.' });
		}

		const { name } = req.body;

		const category = new Category({ name });

		category.save()
			.then(cat => res.send(cat))
			.catch(next);
	},
	createEvent(req, res, next) {
		if (!req.user.admin) {
			return res.status(403).send({ error: 'You are not allowed to do that.' });
		}

		const { 
			name,
			datetime,
			address,
			lat,
			lng,
			description,
			imageUrl,
			categories,
			meals
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
			meals
		});

		event.save()
			.then(e => res.json(e))
			.catch(next);
	},
	updateEvent(req, res, next) {
		if (!req.user.admin) {
			return res.status(403).send({ error: 'You are not allowed to do that.' });
		}

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
			meals
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
				meals
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
		if (!req.user.admin) {
			return res.status(403).send({ error: 'You are not allowed to do that.' });
		}

		const { event_id } = req.params;
		
		Event.findByIdAndRemove(event_id)
			.then(removedEvent => res.send(removedEvent))
			.catch(next);
	},
	createMeal(req, res, next) {
		if (!req.user.admin) {
			return res.status(403).send({ error: 'You are not allowed to do that.' });
		}

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
	}
};