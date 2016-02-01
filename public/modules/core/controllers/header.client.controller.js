'use strict';

angular.module('core').controller('HeaderController', ['$window', '$scope', 'Authentication', 'Menus', 'Gafglobals', '$rootScope',
	function($window, $scope, Authentication, Menus, Gafglobals, $rootScope) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.allowLogout = true;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.checkForSave = function(){

			console.log('Checking for save.....');
			if (Gafglobals.getGafScriptChanged()){
				var confm = $window.confirm('The Document has been changed!! Do you want to SAVE it?');

				if (confm){
					$scope.allowLogout = false;
					$rootScope.doDocSave = true;					
				}else{
					$scope.allowLogout = true;
				}
			}else {$scope.allowLogout = true;}
			
			
		};
	}
]);
