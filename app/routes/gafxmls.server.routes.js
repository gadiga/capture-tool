'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gafxmls = require('../../app/controllers/gafxmls.server.controller');

	app.route('/gafxmls/close')
		.put(users.requiresLogin, gafxmls.hasAuthorization, gafxmls.closeDocument);

	app.route('/gafxmls/publish')
		.put(users.requiresLogin, gafxmls.hasAuthorization, gafxmls.publishDocument);

	app.route('/gafxmls/freeze')
		.put(users.requiresLogin, gafxmls.hasAuthorization, gafxmls.freezeDocument);

	app.route('/gafxmls/edit')
		.put(users.requiresLogin, gafxmls.hasAuthorization, gafxmls.editDocument);

	// Gafxmls Routes
	app.route('/gafxmls')
		.get(gafxmls.list)
		.post(users.requiresLogin, gafxmls.create);
		// .put(users.requiresLogin, gafxmls.hasAuthorization, gafxmls.update);

	app.route('/gafxmls/:gafxmlId')
		.get(gafxmls.read)
		.put(users.requiresLogin, gafxmls.hasAuthorization, gafxmls.update)
		.delete(users.requiresLogin, gafxmls.hasAuthorization, gafxmls.delete);

	// Finish by binding the Gafxml middleware
	app.param('gafxmlId', gafxmls.gafxmlByID);
};
