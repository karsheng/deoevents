const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const faker = require('faker');
const createAdmin = require('../helper/create_admin_helper');
const createUser = require('../helper/create_user_helper');
const createEvent = require('../helper/create_event_helper');
const createCategory = require('../helper/create_category_helper');
const updateEvent = require('../helper/update_event_helper');
const mongoose = require('mongoose');
const User = mongoose.model('user');

describe('Registration Rules', function(done) {
	this.timeout(20000);

	var event;
	var adminToken, userToken;
	var cat1;

	beforeEach(done => {
		createAdmin('admin@deo.com', 'qwerty123')
		.then(at => {
			adminToken = at;
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
						'Test Event',
						new Date().getTime(),
						'Test Location',
						3.123,
						101.123,
						faker.lorem.paragraphs(),
						faker.image.imageUrl(),
						[cat1],
						[],
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
							[],
							new Date(1957, 1, 2)
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

	it('Returns error if user age does not fall within allowable age range', done => {
		request(app)
			.post(`/event/register/${event._id}`)
			.set('authorization', userToken)
			.send({	
				category: cat1
			})
			.end((err, res) => {
				// user born in 1957, age limit is 21 to 48
				// return with error
				assert(res.body.error === 'You cannot register for this category');
				done();
			});
	});
});