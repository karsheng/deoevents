const Category = require('../models/category');

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
	}
};