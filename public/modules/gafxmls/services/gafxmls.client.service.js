'use strict';

//Gafxmls service used to communicate Gafxmls REST endpoints
angular.module('gafxmls').factory('Gafxmls', ['$resource',
	function($resource) {
		return $resource('gafxmls/:gafxmlId', { gafxmlId: '@_id'
		}, {
			get: {
				method: 'GET',
				cache: false				
			},
			update: {
				method: 'PUT',
				cache: false
			},
			json2xml: {
				method: 'POST',
				url:'/gafxmlfile',
        		responseType: 'text',
				cache: false
			},
			close: {
				method: 'PUT',
				url:'/gafxmls/close',
				cache: false
			},
			publish: {
				method: 'PUT',
				url:'/gafxmls/publish',
				cache: false
			},
			edit: {
				method: 'PUT',
				url:'/gafxmls/edit',
				cache: false
			},
			xml2json: {
				method: 'POST',
				headers: {
			        'Content-Type': 'application/json; charset=utf-8'
			    },
				url:'http://lorry.cc.telcordia.com:9595/GAFXMLRestAPI/resources/login/translate?',
        		responseType: 'text',
				cache: false
			},
			publishXML: {
				method: 'POST',
				headers: {
			        'Content-Type': 'application/json; charset=utf-8'
			    },
				url:'http://lorry.cc.telcordia.com:9595/GAFXMLRestAPI/resources/login/translate?',
				// url:'http://localhost:8080/GAFXMLRestAPI/resources/login/translate?',
        		responseType: 'json',
				cache: false
			},
			freezeDoc: {
				method: 'PUT',
				url:'/gafxmls/freeze',
				cache: false
			},
			publishImage: {
				method: 'POST',
				headers: {
			        'Content-Type': 'application/json; charset=utf-8'
			    },
				url:'http://lorry.cc.telcordia.com:9595/GAFXMLRestAPI/resources/login/uploadImage?',
				// url:'http://localhost:8080/GAFXMLRestAPI/resources/login/uploadImage?',
        		responseType: 'json',
				cache: false
			}
		});
	}
]);