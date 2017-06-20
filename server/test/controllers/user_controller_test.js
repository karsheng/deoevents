const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const createUser = require('../../helper/create_user_helper');
const createEvent = require('../../helper/create_event_helper');
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
					[cat1, cat2, cat3, cat4]
				)
				.then(ut => {
					userToken = ut;
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
							'Event 1',
							new Date().getTime(),
							'Desa Parkcity',
							3.1862,
							101.6299,
							faker.lorem.paragraph(),
							faker.image.imageUrl(),
							[cat1, cat2, cat3, cat4],
							[meal1, meal2, meal3]
						)
						.then(e => {
							event = e;
							done();
						});
					});
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

	it('POST to /event/register register a user to event', done => {
		request(app)
			.post(`/event/register/${event._id}`)
			.set('authorization', userToken)
			.send({
				category: cat1
			})
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

	it('PUT to /event/register/:event_id updates the registration', done => {
		createRegistration(userToken, event._id, cat1)
		.then(reg => {
			request(app)
				.put(`/event/register/${event._id}`)
				.set('authorization', userToken)
				.send({
					category: cat2
				})
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

	it('DELETE to /event/register/:event_id removes the registration', done => {
		createRegistration(userToken, event._id, cat1)
			.then(reg => {
				request(app)
					.delete(`/event/register/${event._id}`)
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