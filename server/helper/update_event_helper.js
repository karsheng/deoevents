const request = require('supertest');
const app = require('../app');


module.exports = (token, event_id, name, datetime, address, lat, lng, description, imageUrl, categories, meals, open, collectionInfo, resultUrl) => {
	return new Promise((resolve, reject) => {
		request(app)
			.put(`/api/admin/event/${event_id}`)
			.set('admin-authorization', token)
			.send({ 
				name,
				datetime,
				address,
				lat,
				lng,
				description,
				imageUrl,
				categories,
				meals,
				open,
				collectionInfo,
				resultUrl			
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
}