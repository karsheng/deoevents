const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createRegistration = require('../../helper/create_registration_helper');
const createCategory = require('../../helper/create_category_helper');
const createUser = require('../../helper/create_user_helper');
const createEvent = require('../../helper/create_event_helper');
const updateEvent = require('../../helper/update_event_helper');
const createMeal = require('../../helper/create_meal_helper');
const faker = require('faker');
const mongoose = require('mongoose');
const Registration = mongoose.model('registration');

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

	it('GET to /registration/:event_id retrieves registration info', done => {
		const orders = [
			{ meal: meal1, quantity: 1 },
			{ meal: meal2, quantity: 2 }
		];
		createRegistration(userToken, event._id, cat1, orders)
		.then(reg => {
			request(app)
				.get(`/registration/${event._id}`)
				.set('authorization', userToken)
				.end((err, res) => {
					assert(res.body.event.name === 'Event 1');
					assert(res.body.orders.length === 2);
					assert(res.body.totalBill === 105);
					done();
				});
		});
	});

	it('POST to /event/register/:event_id creates a registration', done => {
		request(app)
			.post(`/event/register/${event._id}`)
			.send({
				category: cat1,
				orders: [
					{ meal: meal1, quantity: 1 },
					{ meal: meal2, quantity: 2 }
				]
			})
			.set('authorization', userToken)
			.end((err, res) => {
				Registration.findById(res.body._id)
				.populate({ path: 'user', model: 'user' })
				.populate({ path: 'event', model: 'event' })
				.populate({ path: 'category', model: 'category' })
				.then(reg => {
					assert(reg.totalBill === 105);
					assert(reg.event.name === 'Event 1');
					assert(reg.user.name === 'Gavin Belson');
					assert(reg.category.name === '5km');
					assert(reg.paid === false);
					done();
				});
			});
	});
});