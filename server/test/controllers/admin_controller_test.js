const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const createMeal = require('../../helper/create_meal_helper');
const createEvent = require('../../helper/create_event_helper');
const updateEvent = require('../../helper/update_event_helper');
const createAssociate = require('../../helper/create_associate_helper');
const faker = require('faker');
const Event = mongoose.model('event');
const Meal = mongoose.model('meal');
const Associate = mongoose.model('associate');
const Category = mongoose.model('category');

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
			createEvent(adminToken, 'Test Event')
			.then(e => {
				Promise.all([
					createCategory(adminToken, '5km', 50, true, 21, 48, 1000, e, 'RM 100'),
					createCategory(adminToken, '10km', 60, true, 21, 48, 1000, e, 'RM 100'),
					createCategory(adminToken, 'half-marathon', 70, true, 21, 48, 1000, e, 'RM 100'),
					createCategory(adminToken, 'full-marathon', 80, true, 21, 48, 1000, e, 'RM 100'),
				])
				.then(cats => {
					cat1 = cats[0];
					cat2 = cats[1];
					cat3 = cats[2];
					cat4 = cats[3];

					Promise.all([
						createMeal(adminToken, 'Food 1', 11.0, faker.lorem.paragraph(), faker.image.food()),
						createMeal(adminToken, 'Food 2', 22.0, faker.lorem.paragraph(), faker.image.food()),
						createMeal(adminToken, 'Food 3', 33.0, faker.lorem.paragraph(), faker.image.food())
					])			
					.then(meals => {
						meal1 = meals[0];
						meal2 = meals[1];
						meal3 = meals[2];
						updateEvent(
							adminToken,
							e._id,
							'Test Event',
							new Date().getTime(),
							'Test Location',
							3.123,
							101.123,
							faker.lorem.paragraphs(),
							faker.image.imageUrl(),
							[cat1, cat2, cat3, cat4],
							[meal1, meal2, meal3],
							true,
							{
								address: '1 Newell Road',
								time: '11th Nov 2017, 12th Nov 2017',
								description: 'collection description'
							},
							'http:result.com/result'
						)
						.then(updatedEvent => {
							event = updatedEvent;
							done();
						});
					});
				});
			});
		});
	});


	it('POST to /api/admin/category creates a new category', done => {
		request(app)
			.post('/api/admin/category')
			.set('admin-authorization', adminToken)
			.send({
				name: '5km Women',
				price: 50,
				gender: false,
				ageMin: 21,
				ageMax: 99,
				participantLimit: 20,
				event: event,
				prize: 'RM 100'
			})
			.end((err, res) => {
				Category.findOne({ name: '5km Women' })
				.then(result => {
					assert(result.price === 50);
					assert(result.gender === false);
					assert(result.participantLimit === 20);
					assert(result.event.toString() === event._id.toString());
					assert(result.prize === 'RM 100');
					done();
				});
			});
	});

	it('DELETE to /api/admin/category/category_id deletes a category', done => {
		request(app)
			.delete(`/api/admin/category/${cat1._id}`)
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				Category.findOne({ name: '5km'})
					.then(result => {
						assert(result === null);
						done();
					});
			});
	});

	it('POST to /api/admin/event creates a new event', done => {
		request(app)
			.post('/api/admin/event')
			.set('admin-authorization', adminToken)
			.send({
				name: 'Event 1'
			})
			.end((err, res) => {
				Event.findOne({ name: 'Event 1'})
					.then(result => {
						assert(result.name === 'Event 1');
						done();
					});
			});
	});

	it('PUT to /api/admin/event/:event_id updates the event', done => {
		request(app)
			.put(`/api/admin/event/${event._id}`)
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
				meals: [meal1, meal2],
				open: false,
				collectionInfo: [{
					address: '1 Newell Road',
					time: '11 Nov 2017, 12 Nov 2017',
					description: 'Collection description'
				}],
				resultUrl: 'http:result.com/result'
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
					assert(e.open === false);
					assert(e.collectionInfo[0].address === '1 Newell Road');
					assert(e.resultUrl === 'http:result.com/result');
					done();
				});
			});
	});

	it('DELETE to /api/admin/event/:event_id removes the event', done => {
		request(app)
			.delete(`/api/admin/event/${event._id}`)
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				Event.findOne({ name: 'Test Event'})
					.then(e => {
						assert(e === null);
						done();
					});
			});
	});

	it('GET to /api/admin/meal/:meal_id returns a meal', done => {
		request(app)
			.get(`/api/admin/meal/${meal1._id}`)
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				assert(res.body.name === 'Food 1');
				assert(res.body.price === 11.0);
				done();
			});
	});

	it('GET to /api/admin/meal/all returns all meals', done => {
		request(app)
			.get('/api/admin/meal/all')
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				assert(res.body.length === 3);
				done();
			});
	});

	it('POST to /api/admin/meal creates a meal', done => {
		request(app)
			.post('/api/admin/meal')
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

	it('DELETE to /api/admin/meal/:meal_id deletes a meal', done => {
		assert(meal1.name === 'Food 1');
		request(app)
			.delete(`/api/admin/meal/${meal1._id}`)
			.set('admin-authorization', adminToken)
			.end((err, res) => {
				Meal.findById(res.body._id)
					.then(result => {
						assert(result === null);
						done();
					});
			});
	});

	it('POST to /api/admin/associate creates an associate', done => {
		request(app)
			.post('/api/admin/associate')
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

	it('PUT to /api/admin/associate/associate_id updates an associate info', done => {
		createAssociate(
			adminToken,
			'Adidass',
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
			assert(asso.name === 'Adidass');
			assert(asso.description === 'Key sponsor');
			request(app)
				.put(`/api/admin/associate/${asso._id}`)
				.set('admin-authorization', adminToken)
				.send({
					name: 'Adidas',
					logo: faker.image.sports(),
					imageUrl: faker.image.imageUrl(),
					address1: 'Adidas Street 1',
					address2: 'Adidas City',
					city: 'Berlin',
					postcode: 13586,
					country: 'Germany',
					description: 'Key sponsor and partner'
				})
				.end((err, res) => {
					Associate.findOne({ name: 'Adidas' })
						.then(result => {
							assert(result.name === 'Adidas');
							assert(result.description === 'Key sponsor and partner');
							done();
						});
				});
		});
	});

	it('DELETE to /api/admin/associate/associate_id deletes an associate', done => {
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
			Associate.findById(asso._id)
			.then(asso => {
				assert(asso.name === 'Adidas');
				request(app)
					.delete(`/api/admin/associate/${asso._id}`)
					.set('admin-authorization', adminToken)
					.end((err, res) => {
						Associate.findById(asso._id)
							.then(result => {
								assert(result === null);
								done();
							});
					});
			})
		});
	});
});