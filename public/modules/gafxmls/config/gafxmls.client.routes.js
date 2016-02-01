'use strict';

//Setting up route
angular.module('gafxmls').config(['$stateProvider',
	function($stateProvider) {
		// Gafxmls state routing
		$stateProvider.
		state('listGafxmls', {
			url: '/gafxmls',
			templateUrl: 'modules/gafxmls/views/list-gafxmls.client.view.html'
		}).
		state('createGafxml', {
			url: '/gafxmls/create',
			templateUrl: 'modules/gafxmls/views/create-gafxml.client.view.html'
		}).
		state('viewGafxml', {
			url: '/gafxmls/:gafxmlId',
			templateUrl: 'modules/gafxmls/views/view-gafxml.client.view.html'
		}).
		state('editGafxml', {
			url: '/gafxmls/:gafxmlId/edit',
			templateUrl: 'modules/gafxmls/views/edit-gafxml.client.view.html'
		});
	}
]);

angular.module('gafxmls').config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);