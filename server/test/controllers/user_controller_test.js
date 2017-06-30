const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const createUser = require('../../helper/create_user_helper');
const createEvent = require('../../helper/create_event_helper');
const updateEvent = require('../../helper/update_event_helper');
const createMeal = require('../../helper/create_meal_helper');
const createOrder = require('../../helper/create_order_helper');
const createRegistration = require('../../helper/create_registration_helper');
const faker = require('faker');
const mongoose = require('mongoose');
const Registration = mongoose.model('registration');
const Order = mongoose.model('order');

describe('User Controller', function(done) {
	this.timeout(15000);
	var adminToken, userToken;
	var cat1, cat2, cat3, cat4;
	var meal1, meal2, meal3;
	var event;
	var order;

	beforeEach(done => {
		createAdmin('karshenglee@gmail.com', 'qwerty123')
		.then(token => {
			adminToken = token;
			Promise.all([
				createMeal(adminToken, 'Food 1', 11.0, faker.lorem.paragraph(), faker.image.food()),
				createMeal(adminToken, 'Food 2', 22.0, faker.lorem.paragraph(), faker.image.food()),
				createMeal(adminToken, 'Food 3', 33.0, faker.lorem.paragraph(), faker.image.food())
			])
			.then(meals => {
				meal1 = meals[0];
				meal2 = meals[1];
				meal3 = meals[2];

				createEvent(adminToken, 'Event 1')
				.then(e => {
					Promise.all([
						createCategory(adminToken, '5km', 50, true, 21, 48, 1000, e),
						createCategory(adminToken, '10km', 60, true, 21, 48, 1000, e),
						createCategory(adminToken, 'half-marathon', 70, true, 21, 48, 1000, e),
						createCategory(adminToken, 'full-marathon', 80, true, 21, 48, 1000, e),
					])
					.then(cats => {
						cat1 = cats[0];
						cat2 = cats[1];
						cat3 = cats[2];
						cat4 = cats[3];
						updateEvent(
							adminToken,
							e._id,
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
						)
						.then(updatedEvent => {
							event = updatedEvent;
							createUser(
								'Gavin Belson',
								'gavin@hooli.com',
								'qwerty123',
								true,
								'100 Hooli Road',
								'Silicon Valley',
								'Palo Alto',
								'San Francisco',
								45720,
								'U.S.',
								['5km', '10km', 'Half-marathon', 'Full-marathon'],
								new Date(1988, 1, 2)
							)
							.then(ut => {
								userToken = ut;
								done();
							});
						});
					});
				});
			});			
		});
	});

	it('GET to /meal/order/:registration_id returns a meal order', done => {
		createRegistration(userToken, event._id, cat1)
		.then(registration => {
			createOrder(userToken, meal1, registration, 10)
			.then(order => {
				request(app)
					.get(`/meal/order/${order._id}`)
					.set('authorization', userToken)
					.end((err, res) => {
						assert(res.body.meal.name === 'Food 1');
						assert(res.body.quantity === 10);
						assert(res.body.registration.toString() === registration._id.toString());
						done();
					});
			});
		});
	});

	it('POST to /meal/order/:registration_id creates a meal order', done => {
		createRegistration(userToken, event._id, cat1)
		.then(registration => {
			request(app)
				.post(`/meal/order/${registration._id}`)
				.set('authorization', userToken)
				.send({
					meal: meal1,
					registration,
					quantity: 1
				})
				.end((err, res)=> {
					Order.findById(res.body._id)
						.populate({ path: 'meal', ref: 'meal' })
						.populate({ path: 'user', ref: 'user' })
						.then(order => {
							assert(order.user.name === 'Gavin Belson');
							assert(order.meal.name === 'Food 1');
							assert(order.registration.toString() === registration._id);
							done();	
						});
				});
		});
	});

	it('PUT to /meal/order/:order_id updates a meal order', done => {
		createRegistration(userToken, event._id, cat1)
		.then(registration => {
			createOrder(userToken, meal1, registration, 10)
				.then(order => {
					request(app)
					.put(`/meal/order/${order._id}`)
					.set('authorization', userToken)
					.send({
						quantity: 20
					})
					.end((err, res) => {
						Order.findById(order._id)
							.then(result => {
								assert(result.quantity === 20);
								done();
							});
					});
				});
		});
	});

	it('DELETE to /meal/order/:order_id deletes a meal order', done => {
		createRegistration(userToken, event._id, cat1)
		.then(registration => {
			createOrder(userToken, meal1, registration, 10)
				.then(order => {
					request(app)
					.delete(`/meal/order/${order._id}`)
					.set('authorization', userToken)
					.end((err, res) => {
						Order.findById(order._id)
							.then(result => {
								assert(result === null);
								done();
							});
					});
				});
		});
	});	


	it('GET to /event/register/:registration_id returns registration info', done => {
		createRegistration(userToken, event._id, cat1)
		.then(registration => {
			request(app)
			.get(`/event/register/${registration._id}`)
			.set('authorization', userToken)
			.end((err, res) => {
				assert(res.body.event.name === 'Event 1');
				assert(res.body.category.name === '5km');
				assert(res.body.paid === false);
				done();
			});
		});
	});

	it('POST to /event/register/:registration_id/:category_id register a user to event', done => {
		request(app)
			.post(`/event/register/${event._id}/${cat1._id}`)
			.set('authorization', userToken)
			.end((err, res) => {
				Registration.findById(res.body._id)
				.populate({ path: 'user', model: 'user' })
				.populate({ path: 'event', model: 'event' })
				.populate({ path: 'category', model: 'category' })
				.then(reg => {
					assert(reg.event.name === 'Event 1');
					assert(reg.user.name === 'Gavin Belson');
					assert(reg.category.name === '5km');
					assert(reg.paid === false);
					done();
				});
			});
	});

	it('PUT to /event/register/:registration_id/:category_id updates the registration', done => {
		createRegistration(userToken, event._id, cat1)
		.then(reg => {
			request(app)
				.put(`/event/register/${reg._id}/${cat2._id}`)
				.set('authorization', userToken)
				.end((err, res) => {
					Registration.findById(res.body._id)
						.populate({ path: 'category', model: 'category' })
						.then(reg => {
							assert(reg.category.name === '10km');
							done();
						});
				});
		});
	});

	it('DELETE to /event/register/:registration_id removes the registration', done => {
		createRegistration(userToken, event._id, cat1)
			.then(reg => {
				request(app)
					.delete(`/event/register/${reg._id}`)
					.set('authorization', userToken)
					.end((err, res) => {

						Registration.findById(reg._id)
							.then(result => {
								assert(result === null);
								done();
							});
					});
			});
		});
});