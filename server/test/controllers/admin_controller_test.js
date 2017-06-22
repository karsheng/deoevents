const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const createMeal = require('../../helper/create_meal_helper');
const createEvent = require('../../helper/create_event_helper');
const faker = require('faker');
const Event = mongoose.model('event');
const Meal = mongoose.model('meal');
const Associate = mongoose.model('associate');

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
			cat1 = createCategory('5km', 50);
			cat2 = createCategory('10km', 60);
			cat3 = createCategory('half-marathon', 70);
			cat4 = createCategory('full-marathon', 80);

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

	it('POST to /admin/event creates a new event', done => {
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
				categories: [cat1, cat2, cat3],
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
				});
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

	it('GET to /admin/meal/:meal_id returns a meal', done => {
		request(app)
			.get(`/admin/meal/${meal1._id}`)
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				assert(res.body.name === 'Food 1');
				assert(res.body.price === 11.0);
				done();
			});
	});

	it('GET to /admin/meal/all returns all meals', done => {
		request(app)
			.get('/admin/meal/all')
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				assert(res.body.length === 3);
				done();
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

	it('DELETE to /admin/meal/:meal_id deletes a meal', done => {
		assert(meal1.name === 'Food 1');
		request(app)
			.delete(`/admin/meal/${meal1._id}`)
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				Meal.findById(res.body._id)
					.then(result => {
						assert(result === null);
						done();
					});
			});
	});

	it('POST to /admin/associate creates an associate', done => {
		request(app)
			.post('/admin/associate')
			.set('admin-authorization', adminToken)
			.send({
				name: 'Adidas',
				logo: faker.image.sports(),
				imageUrl: faker.image.imageUrl(),
				address1: 'Adidas Street 1',
				address2: 'Adidas City',
				city: 'Berlin',
				postcode: 13586,
				description: 'Key sponsor'
			})
			.end((err, res) => {
				Associate.findOne({ name: 'Adidas'})
				.then(result => {
					assert(result.address1 === 'Adidas Street 1');
					assert(result.address2 === 'Adidas City');
					done();
				});
			});
	});
});