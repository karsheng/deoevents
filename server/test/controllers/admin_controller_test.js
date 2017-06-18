const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const Category = mongoose.model('category');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const createMeal = require('../../helper/create_meal_helper');
const createEvent = require('../../helper/create_event_helper');
const faker = require('faker');
const Event = mongoose.model('event');
const Meal = mongoose.model('meal');

describe('Admin Controller', function(done) {
	this.timeout(20000);
	var adminToken;
	var cat1, cat2, cat3, cat4;
	var meal1, meal2, meal3;
	var event;

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
					createEvent(
						adminToken,
						'Test Event',
						new Date().getTime(),
						'Test Location',
						3.123,
						101.123,
						faker.lorem.paragraphs(),
						faker.image.imageUrl(),
						[cat1, cat2, cat3, cat4],
						[meal1, meal2, meal3]
					).then(e => {
						event = e;
						done();
					});
				});
			});
		});
	});

	it('/POST to /admin/category creates a new category', done => {
		request(app)
			.post('/admin/category')
			.set('admin-authorization', adminToken)
			.send({ name: '10km' })
			.end((err, res) => {
				Category.findOne({ name: '10km' })
					.then(cat => {
						assert(cat.name === '10km');
						done();
					});
			});
	});

	it('DELETE to /admin/category/:category_id removes a category', done => {
		request(app)
			.delete(`/admin/category/${cat1._id}`)
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				Category.findOne({ name: '5km' })
					.then(cat => {
						assert(cat === null);
						done();
					});
			});
	});

	it('/POST to /admin/event creates a new event', done => {
		request(app)
			.post('/admin/event')
			.set('admin-authorization', adminToken)
			.send({
				name: 'Event 1',
				datetime: new Date().getTime(),
				address: 'Desa Parkcity',
				lat: 3.1862,
				lng: 101.6299,
				description: faker.lorem.paragraph(),
				imageUrl: faker.image.imageUrl(),
				categories: [cat1, cat2, cat3, cat4],
				meals: [meal1, meal2, meal3]
			})
			.end((err, res) => {
				Event.findOne({ name: 'Event 1'})
					.populate({ path: 'meals', ref: 'meal' })
					.then(event => {
						assert(event.name === 'Event 1');
						assert(event.address === 'Desa Parkcity');
						assert(event.lat === 3.1862);
						assert(event.meals[0].name === 'Food 1');
						done();
					});
			});
	});

	it('PUT to /admin/event/:event_id updates the event', done => {
		request(app)
			.put(`/admin/event/${event._id}`)
			.set('admin-authorization', adminToken)
			.send({
				name: 'Changed Event Name',
				datetime: new Date().getTime(),
				address: 'Changed Address',
				lat: 3.9,
				lng: 101.9,
				description: 'Changed Description',
				imageUrl: '/changedurl/image.jpg',
				categories: [cat1, cat2],
				meals: [meal1, meal2]
			})
			.end((err, res) => {
				Event.findOne({ name: 'Changed Event Name'})
				.then(e => {
					assert(e.lat === 3.9);
					assert(e.lng === 101.9);
					assert(e.description === 'Changed Description');
					assert(e.imageUrl === '/changedurl/image.jpg');
					assert(e.categories.length === 2);
					assert(e.meals.length === 2);
					done();
				})
			});
	});

	it('DELETE to /admin/event/:event_id removes the event', done => {
		request(app)
			.delete(`/admin/event/${event._id}`)
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				Event.findOne({ name: 'Test Event'})
					.then(e => {
						assert(e === null);
						done();
					});
			});
	});

	it('POST to /admin/meal creates a meal', done => {
		request(app)
			.post('/admin/meal')
			.set('admin-authorization', adminToken)
			.send({
				name: 'Special Food',
				price: 29.9,
				description: 'The best food ever',
				imageUrl: faker.image.food()
			})
			.end((err, res) => {
				Meal.findOne({ name: 'Special Food' })
				.then(food => {
					assert(food.price === 29.9);
					assert(food.description === 'The best food ever');
					done();
				});
			});
	});
});