'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Gafxml = mongoose.model('Gafxml'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gafxml;

/**
 * Gafxml routes tests
 */
describe('Gafxml CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Gafxml
		user.save(function() {
			gafxml = {
				name: 'Gafxml Name'
			};

			done();
		});
	});

	it('should be able to save Gafxml instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gafxml
				agent.post('/gafxmls')
					.send(gafxml)
					.expect(200)
					.end(function(gafxmlSaveErr, gafxmlSaveRes) {
						// Handle Gafxml save error
						if (gafxmlSaveErr) done(gafxmlSaveErr);

						// Get a list of Gafxmls
						agent.get('/gafxmls')
							.end(function(gafxmlsGetErr, gafxmlsGetRes) {
								// Handle Gafxml save error
								if (gafxmlsGetErr) done(gafxmlsGetErr);

								// Get Gafxmls list
								var gafxmls = gafxmlsGetRes.body;

								// Set assertions
								(gafxmls[0].user._id).should.equal(userId);
								(gafxmls[0].name).should.match('Gafxml Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gafxml instance if not logged in', function(done) {
		agent.post('/gafxmls')
			.send(gafxml)
			.expect(401)
			.end(function(gafxmlSaveErr, gafxmlSaveRes) {
				// Call the assertion callback
				done(gafxmlSaveErr);
			});
	});

	it('should not be able to save Gafxml instance if no name is provided', function(done) {
		// Invalidate name field
		gafxml.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gafxml
				agent.post('/gafxmls')
					.send(gafxml)
					.expect(400)
					.end(function(gafxmlSaveErr, gafxmlSaveRes) {
						// Set message assertion
						(gafxmlSaveRes.body.message).should.match('Please fill Gafxml name');
						
						// Handle Gafxml save error
						done(gafxmlSaveErr);
					});
			});
	});

	it('should be able to update Gafxml instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gafxml
				agent.post('/gafxmls')
					.send(gafxml)
					.expect(200)
					.end(function(gafxmlSaveErr, gafxmlSaveRes) {
						// Handle Gafxml save error
						if (gafxmlSaveErr) done(gafxmlSaveErr);

						// Update Gafxml name
						gafxml.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gafxml
						agent.put('/gafxmls/' + gafxmlSaveRes.body._id)
							.send(gafxml)
							.expect(200)
							.end(function(gafxmlUpdateErr, gafxmlUpdateRes) {
								// Handle Gafxml update error
								if (gafxmlUpdateErr) done(gafxmlUpdateErr);

								// Set assertions
								(gafxmlUpdateRes.body._id).should.equal(gafxmlSaveRes.body._id);
								(gafxmlUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gafxmls if not signed in', function(done) {
		// Create new Gafxml model instance
		var gafxmlObj = new Gafxml(gafxml);

		// Save the Gafxml
		gafxmlObj.save(function() {
			// Request Gafxmls
			request(app).get('/gafxmls')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gafxml if not signed in', function(done) {
		// Create new Gafxml model instance
		var gafxmlObj = new Gafxml(gafxml);

		// Save the Gafxml
		gafxmlObj.save(function() {
			request(app).get('/gafxmls/' + gafxmlObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gafxml.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gafxml instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gafxml
				agent.post('/gafxmls')
					.send(gafxml)
					.expect(200)
					.end(function(gafxmlSaveErr, gafxmlSaveRes) {
						// Handle Gafxml save error
						if (gafxmlSaveErr) done(gafxmlSaveErr);

						// Delete existing Gafxml
						agent.delete('/gafxmls/' + gafxmlSaveRes.body._id)
							.send(gafxml)
							.expect(200)
							.end(function(gafxmlDeleteErr, gafxmlDeleteRes) {
								// Handle Gafxml error error
								if (gafxmlDeleteErr) done(gafxmlDeleteErr);

								// Set assertions
								(gafxmlDeleteRes.body._id).should.equal(gafxmlSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gafxml instance if not signed in', function(done) {
		// Set Gafxml user 
		gafxml.user = user;

		// Create new Gafxml model instance
		var gafxmlObj = new Gafxml(gafxml);

		// Save the Gafxml
		gafxmlObj.save(function() {
			// Try deleting Gafxml
			request(app).delete('/gafxmls/' + gafxmlObj._id)
			.expect(401)
			.end(function(gafxmlDeleteErr, gafxmlDeleteRes) {
				// Set message assertion
				(gafxmlDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gafxml error error
				done(gafxmlDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Gafxml.remove().exec();
		done();
	});
});