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
const createInterest = require('../../helper/create_interest_helper');
const createRegistration = require('../../helper/create_registration_helper');
const createPayPalPayment = require('../../helper/create_paypal_payment_helper');
const faker = require('faker');
const Payment = require('../../models/payment');

describe('PayPal Payment Controller', function(done){
	this.timeout(20000);
	var adminToken, userToken;
	var cat1;
	var int1, int2, int3, int4;
	var meal1, meal2;
	var event;

	beforeEach(done => {
		createAdmin('karshenglee@gmail.com', 'qwerty123')
		.then(token => {
			adminToken = token;
			Promise.all([
				createMeal(adminToken, 'Food 1', 10.0, faker.lorem.paragraph(), faker.image.food()),
				createMeal(adminToken, 'Food 2', 20.0, faker.lorem.paragraph(), faker.image.food())
			])
			.then(meals => {
				meal1 = meals[0];
				meal2 = meals[1];

				createEvent(adminToken, 'Event 1')
				.then(e => {
					Promise.all([
						createCategory(adminToken, '5km', 50, true, 21, 48, 1000, e)
					])
					.then(cats => {
						cat1 = cats[0];
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
							[cat1],
							[meal1, meal2],
							true
						)
						.then(updatedEvent => {
							event = updatedEvent;
							Promise.all([
								createInterest(adminToken, '5km'),
								createInterest(adminToken, '10km'),
								createInterest(adminToken, 'half-marathon'),
								createInterest(adminToken, 'full-marathon')
							])
							.then(interests => {
								int1 = interests[0];
								int2 = interests[1];
								int3 = interests[2];
								int4 = interests[3];
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
									[int1, int2, int3, int4],
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
	});



	it('POST to /paypal/create-payment/:registration_id creates payment and returns a paymentID', done => {
		createRegistration(userToken, event._id, cat1)
		.then(registration => {
			Promise.all([
				createOrder(userToken, meal1, registration, 1),
				createOrder(userToken, meal2, registration, 1)
			])
			.then(orders => {
				request(app)
					.post(`/paypal/create-payment/${registration._id}`)
					.set('authorization', userToken)
					.end((err, res) => {
						assert(res.body.paymentID === 'PAY-123ABC456DEF789');
						done();
					});
			});
		});
	});

	it('POST to /paypal/execute-payment/:registration_id executes and saves payment and updates registrations and orders paid attribute to true', done => {
		createRegistration(userToken, event._id, cat1)
		.then(registration => {
			Promise.all([
				createOrder(userToken, meal1, registration, 1),
				createOrder(userToken, meal2, registration, 1)
			])
			.then(orders => {
				createPayPalPayment(userToken, registration)
				.then(paypalObj => {
					request(app)
						.post(`/paypal/execute-payment/${registration._id}`)
						.set('authorization', userToken)
						.send({
							payment_id: paypalObj.paymentID, 
							payer_id: 'payer_id'
						})
						.end((err, res) => {
							Payment.findById(res.body._id)
							.populate({ path: 'registration', model: 'registration' })
							.populate({ path: 'orders', model: 'order' })
							.then(payment => {
								assert(payment.registration.paid === true);
								assert(payment.orders[0].paid === true);
								assert(payment.orders[1].paid === true);
								assert(payment.amount === 80);
								assert(payment.currency === 'MYR');
								done();
							});
						});
				}); 
			});
		});
	});
});