'use strict';

angular.module('core').factory('Home', ['$resource',
	function($resource) {
		return $resource('gafxmlfile', {}, {
			getGAFXMLSchema: {
				method: 'GET'
			}
		});
	}
]);