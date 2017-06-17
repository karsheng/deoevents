const Category = require('../models/category');
const Event = require('../models/event');

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
			categories
		} = req.body;

		const event = new Event({
			name,
			datetime,
			address,
			lat,
			lng,
			description,
			imageUrl,
			categories			
		});

		event.save()
			.then(e => res.json(e))
			.catch(next);
	}
};