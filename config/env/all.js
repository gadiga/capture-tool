'use strict';

module.exports = {
	app: {
		title: 'Central Appendix Publishing & Translation Utility to Realize Efficiency',
		description: 'XML Generator for GAF',
		keywords: 'GAF Tool, XML Generator'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular.treeview-master/angular.treeview.css',
				'public/lib/angular-xeditable/css/xeditable.css',
				'public/lib/bootstrap/dist/css/font-awesome.min.css',
				'public/lib/angular-resizable-master/angular-resizable.min.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular.treeview-master/angular.treeview.js',
				'public/lib/angular-xeditable/js/xeditable.js',
				'public/lib/angular-checklist-model-master/checklist-model.js',
				'public/lib/angular-resizable-master/angular-resizable.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};