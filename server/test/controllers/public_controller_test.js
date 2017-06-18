const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const createEvent = require('../../helper/create_event_helper');
const createMeal = require('../../helper/create_meal_helper');
const faker = require('faker');

describe('Public Controller', function(done) {
	this.timeout(15000);
	var adminToken;
	var cat1, cat2, cat3, cat4;
	var meal1, meal2, meal3;
	var event1, event2;

	beforeEach(done => {
		createAdmin('karshenglee@gmail.com', 'qwerty123')
		.then(token => {
			adminToken = token;
			Promise.all([
				createCategory(token, '5km'),
				createCategory(token, '10km'),
				createCategory(token, 'half-marathon'),
				createCategory(token, 'full-marathon')
			])
			.then(categories => {
				cat1 = categories[0];
				cat2 = categories[1];
				cat3 = categories[2];
				cat4 = categories[3];
				Promise.all([
					createMeal(adminToken, 'Food 1', 11.0, faker.lorem.paragraph(), faker.image.food()),
					createMeal(adminToken, 'Food 2', 22.0, faker.lorem.paragraph(), faker.image.food()),
					createMeal(adminToken, 'Food 3', 33.0, faker.lorem.paragraph(), faker.image.food())
				])
				.then(meals => {
					meal1 = meals[0];
					meal2 = meals[1];
					meal3 = meals[2];

					Promise.all([
						createEvent(
							adminToken,
							'Event 1',
							new Date().getTime(),
							'Desa Parkcity',
							3.1862,
							101.6299,
							faker.lorem.paragraph(),
							faker.image.imageUrl(),
							[cat1, cat2, cat3, cat4],
							[meal1, meal2, meal3]
						),
						createEvent(
							adminToken,
							'Event 2',
							new Date().getTime(),
							'Genting Highland',
							4.1862,
							102.6299,
							faker.lorem.paragraph(),
							faker.image.imageUrl(),
							[cat1, cat2],
							[meal1]
						)
					])
					.then( events => {
						event1 = events[0];
						event2 = events[1];
						done();
					});
				}); 
			});
		});
	});

	it.only('GET to /event/:event_id returns event info', done => {
		request(app)
			.get(`/event/${event1._id}`)
			.end((err, res) => {
				console.log(res.body);
				done();
			});
	});
});