const mongoose = require('mongoose');
const Event = mongoose.model('event');
const Associate = mongoose.model('associate');

module.exports ={
	getEvent(req, res, next) {
		const { event_id } = req.params;

		Event.findById(event_id)
			.then(event => {
				res.json(event);
			})
			.catch(next);
	},
	getAssociate(req, res, next) {
		const { associate_id } = req.params;

		Associate.findById(associate_id)
			.then(asso => res.json(asso))
			.catch(next);
	}
}