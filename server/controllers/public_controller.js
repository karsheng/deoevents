const mongoose = require('mongoose');
const Event = mongoose.model('event');

module.exports ={
	getEvent(req, res, next) {
		const { event_id } = req.params;

		Event.findById(event_id)
			.populate({ path: 'categories', model: 'category', select: 'name' })
			.then(event => {
				res.json(event);
			})
			.catch(next);
	}
}