const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const createEvent = require('../../helper/create_event_helper');
const createMeal = require('../../helper/create_meal_helper');
const createAssociate = require('../../helper/create_associate_helper')
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
			cat1 = createCategory('5km', 59);
			cat2 = createCategory('10km', 69);
			cat3 = createCategory('half-marathon', 79);
			cat4 = createCategory('full-marathon', 89);
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
						[meal1, meal2, meal3],
						true
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
						[meal1],
						true
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

	it('GET to /event/:event_id returns event info', done => {
		request(app)
			.get(`/event/${event1._id}`)
			.end((err, res) => {
				assert(res.body.name === 'Event 1');
				assert(res.body.categories[0].name === '5km');
				assert(res.body.lat === 3.1862);
				done();
			});
	});

	it('GET to /event/open/all returns all open events', done => {
		request(app)
			.get('/event/open/all')
			.end((err, res) => {
				assert(res.body.length === 2);
				done();
			});
	});

	it('GET to /associate/:associate_id returns an associate', done => {
		createAssociate(
			adminToken,
			'Adidas',
			faker.image.sports(),
			faker.image.imageUrl(),
			'Adidas Street 1',
			'Adidas City',
			'Adidas County',
			'Berlin',
			13586,
			'Germany',
			'Key sponsor'
		)
		.then(asso => {
			request(app)
				.get(`/associate/${asso._id}`)
				.end((err, res) => {
					assert(res.body.name === 'Adidas');
					assert(res.body.address2 === 'Adidas City');
					assert(res.body.postcode === '13586');
					assert(res.body.country === 'Germany');
					done();
				});
		});
	});
});