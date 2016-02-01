'use strict';

module.exports = function(app) {
	var gafxmlfile = require('../../app/controllers/gafxmlfile.server.controller');

	// Gafxmls Routes
	app.route('/gafxmlfile')
		.get(gafxmlfile.read)
		.post(gafxmlfile.json2xml);



	app.route('/gafxmljsonfile')
		.get(gafxmlfile.create);

};