const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const createAdmin = require('../../helper/create_admin_helper');
const createCategory = require('../../helper/create_category_helper');
const createUser = require('../../helper/create_user_helper');
const createEvent = require('../../helper/create_event_helper');
const faker = require('faker');
const mongoose = require('mongoose');
const Registration = mongoose.model('registration');

describe('User Controller', function(done) {
	this.timeout(15000);
	var adminToken, userToken;
	var cat1, cat2, cat3, cat4;
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
					createEvent(
						adminToken,
						'Event 1',
						new Date().getTime(),
						'Desa Parkcity',
						3.1862,
						101.6299,
						faker.lorem.paragraph(),
						faker.image.imageUrl(),
						[cat1, cat2, cat3, cat4]
					)
					.then(e => {
						event = e;
						done();	
					});
				});
			});
		});
	});

	it('POST to /event/register register a user to event', done => {
		request(app)
			.post('/event/register')
			.set('authorization', userToken)
			.send({
				event,
				category: cat1,
				orders: null
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
});