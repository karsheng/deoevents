const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const faker = require('faker');
const createAdmin = require('../helper/create_admin_helper');
const createUser = require('../helper/create_user_helper');
const createEvent = require('../helper/create_event_helper');
const createCategory = require('../helper/create_category_helper');
const createRegistration = require('../helper/create_registration_helper');
const updateEvent = require('../helper/update_event_helper');
const createPayPalPayment = require('../helper/create_paypal_payment_helper');
const executePayPalPayment = require('../helper/execute_paypal_payment_helper');
const mongoose = require('mongoose');
const User = mongoose.model('user');

describe('Registration Rules', function(done) {
	this.timeout(20000);
	var event1, event2;
	var adminToken, userToken1, userToken2;
	var cat1, cat2, cat3, cat4;
	var cat5;

	beforeEach(done => {
		createAdmin('admin@deo.com', 'qwerty123')
		.then(at => {
			adminToken = at;
			Promise.all([
				createEvent(adminToken, 'Event 1'),
				createEvent(adminToken, 'Event 2')
			])
			.then(events => {
				Promise.all([
					createCategory(adminToken, '5km Male 21 to 48', 50, true, 21, 48, 1000, events[0]),
					createCategory(adminToken, '5km Female 48 and above ', 50, false, 48, 999, 1000, events[0]),
					createCategory(adminToken, '10km Male 48 and above ', 50, true, 48, 999, 1000, events[0]),
					createCategory(adminToken, '10km Male 18 and above exclusive', 50, true, 18, 999, 1, events[0]),
					createCategory(adminToken, '10km Male 21 and above (closed) ', 50, true, 21, 999, 1000, events[1]),
				])
				.then(cats => {
					cat1 = cats[0];
					cat2 = cats[1];
					cat3 = cats[2];
					cat4 = cats[3];
					cat5 = cats[4];
					Promise.all([
						updateEvent(
							adminToken,
							events[0]._id,
							'Test Event 1',
							new Date().getTime(),
							'Test Location',
							3.123,
							101.123,
							faker.lorem.paragraphs(),
							faker.image.imageUrl(),
							[cat1, cat2, cat3, cat4],
							[],
							true
						),
						updateEvent(
							adminToken,
							events[1]._id,
							'Test Event 2',
							new Date().getTime(),
							'Test Location',
							3.123,
							101.123,
							faker.lorem.paragraphs(),
							faker.image.imageUrl(),
							[cat5],
							[],
							false
						)
					])
					.then(updatedEvents => {
						event1 = updatedEvents[0];
						event2 = updatedEvents[1];
						Promise.all([
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
								[],
								new Date(1957, 1, 2)
							),
							createUser(
								'Richard Hendricks',
								'richard@piedpiper.com',
								'qwerty123',
								true,
								'5230 Newell Road',
								'East Palo Alto',
								'Palo Alto',
								'San Francisco',
								45720,
								'U.S.',
								[],
								new Date(1988, 1, 2)
							)
						])
						.then(uts => {
							userToken1 = uts[0];
							userToken2 = uts[1];
							done();
						});
					});
				});
			});
		});
	});

	it('Returns error if user age does not fall within allowable age range', done => {
		request(app)
			.post(`/event/register/${event1._id}/${cat1._id}`)
			.set('authorization', userToken1)
			.end((err, res) => {
				// user born in 1957, age limit is 21 to 48
				// return error
				assert(res.body.message === 'You cannot register for this category');
				done();
			});
	});

	it('Returns error if user gender does not match category gender requirement', done => {
		request(app)
			.post(`/event/register/${event1._id}/${cat2._id}`)
			.set('authorization', userToken1)
			.end((err, res) => {
				// user is male, cat2 is for female
				// return error
				assert(res.body.message === 'You cannot register for this category');
				done();
			});
	});

	it('Returns error if user tries to change to a category which they are not eligible for', done => {
		createRegistration(userToken1, event1._id, cat3)
		.then(reg => {
			request(app)
				.put(`/event/register/${reg._id}/${cat2._id}`)
				.set('authorization', userToken1)
				.end((err, res) => {
					assert(res.body.message === 'You cannot register for this category');
					done();
				});
		});
	});

	it('Returns error if user tries to register to the same event more than once', done => {
		createRegistration(userToken1, event1._id, cat3)
		.then(reg => {
			request(app)
				.post(`/event/register/${event1._id}/${cat3._id}`)
				.set('authorization', userToken1)
				.end((err, res) => {
					assert(res.body.message === 'User already registered');
					done();
				});
		});		
	});

	it('Returns error if user tries to register for an event and the participantLimit is met', done => {
		createRegistration(userToken1, event1._id, cat4)
		.then(registration => {
			createPayPalPayment(userToken1, registration)
			.then(paypalObj => {
				executePayPalPayment(userToken1, registration, paypalObj.paymentID, 'payer_id')
				.then(payment => {
					request(app)
						.post(`/event/register/${event1._id}/${cat4._id}`)
						.set('authorization', userToken2)
						.end((err, res) => {
							assert(res.body.message === 'Registration for this category is closed');
							done();
						});
				});
			});
		});
	});

	it('Returns error if user tries to register for an event that is already closed', done => {
		request(app)
			.post(`/event/register/${event2._id}/${cat5._id}`)
			.set('authorization', userToken2)
			.end((err, res) => {
				assert(res.body.message === 'Registration for this category is closed');
				done();
			});
	});
});