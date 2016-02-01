'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'gaf-xml-tool';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'angularTreeview'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core',['angularTreeview','globals','ngAnimate']);
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('gafxmls',['globals','xeditable','checklist-model','angularResizable']);

angular.module('gafxmls').run(["editableOptions", function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('globals');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
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

'use strict';


angular.module('core').controller('HomeController', ['$window','$scope', 'Authentication', 'Home', 'Gafglobals','Gafxmls',
	function($window, $scope, Authentication, Home, Gafglobals, Gafxmls) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		//temporary node
    $scope.temporaryNode = {
        children: []
    };

    $scope.gafxmlXSD = {};
    $scope.gafxmlTables = [];
    $scope.gafxmlNameMappings = [];
    $scope.gafxmlTypes = [];
    $scope.currentTable = [];    
    $scope.screenData = [];
    $scope.gafxmls = [];

    Home.getGAFXMLSchema(function(result){
      
      $scope.gafxmlXSD = result;
      $scope.gafxmlTables = $scope.gafxmlXSD.guiData.table;
      $scope.gafxmlNameMappings = $scope.gafxmlXSD.guiData.nameMappings;
      $scope.gafxmlTypes = $scope.gafxmlXSD.guiData.type;
      $scope.setCurrentTable($scope.gafxmlXSD.guiData.table[0]);
      console.log(JSON.stringify($scope.screenData));
      Gafglobals.setGafGlobals({gafxmlXSD:$scope.gafxmlXSD, gafxmlTables:$scope.gafxmlTables, gafxmlNameMappings:$scope.gafxmlNameMappings, gafxmlTypes:$scope.gafxmlTypes});
      $scope.screenData = Gafglobals.getScreenDataStructure();
      loadGafXMLs();
    });

    $scope.loadGIF = true;

    function loadGafXMLs(){


      Gafxmls.query(function(result){
        $scope.gafxmls = result;
      } );
      $scope.loadGIF = false;
    }

    $scope.setCurrentTable = function(table){
      if ($scope.currentTable){
        for (var i=0, len=$scope.screenData.length;i < len; i++){

          var ctbl = $scope.screenData[i];

          if (ctbl.name === $scope.currentTable.name){

            var tbd = {};

            //--------------------TBD
          }

        }
      }
      $scope.currentTable = table;
    };

    $scope.getColumnHeaders = function(col){
      return Gafglobals.getColumnHeaders(col);
    };


		//test tree model 1
    $scope.roleList1 = [
        { 'roleName' : 'User', 'roleId' : 'role1', 'children' : [
          { 'roleName' : 'subUser1', 'roleId' : 'role11', 'children' : [] },
          { 'roleName' : 'subUser2', 'roleId' : 'role12', 'children' : [
            { 'roleName' : 'subUser2-1', 'roleId' : 'role121', 'children' : [
              { 'roleName' : 'subUser2-1-1', 'roleId' : 'role1211', 'children' : [] },
              { 'roleName' : 'subUser2-1-2', 'roleId' : 'role1212', 'children' : [] }
            ]}
          ]}
        ]},

        { 'roleName' : 'Admin', 'roleId' : 'role2', 'children' : [] },

        { 'roleName' : 'Guest', 'roleId' : 'role3', 'children' : [] }
      ];

  	//test tree model 2
    $scope.roleList2 = [
        { 'roleName' : 'User', 'roleId' : 'role1', 'children' : [
          { 'roleName' : 'subUser1', 'roleId' : 'role11', 'collapsed' : true, 'children' : [] },
          { 'roleName' : 'subUser2', 'roleId' : 'role12', 'collapsed' : true, 'children' : [
            { 'roleName' : 'subUser2-1', 'roleId' : 'role121', 'children' : [
              { 'roleName' : 'subUser2-1-1', 'roleId' : 'role1211', 'children' : [] },
              { 'roleName' : 'subUser2-1-2', 'roleId' : 'role1212', 'children' : [] }
            ]}
          ]}
        ]},

        { 'roleName' : 'Admin', 'roleId' : 'role2', 'children' : [
          { 'roleName' : 'subAdmin1', 'roleId' : 'role11', 'collapsed' : true, 'children' : [] },
          { 'roleName' : 'subAdmin2', 'roleId' : 'role12', 'children' : [
            { 'roleName' : 'subAdmin2-1', 'roleId' : 'role121', 'children' : [
              { 'roleName' : 'subAdmin2-1-1', 'roleId' : 'role1211', 'children' : [] },
              { 'roleName' : 'subAdmin2-1-2', 'roleId' : 'role1212', 'children' : [] }
            ]}
          ]}
        ]},

        { 'roleName' : 'Guest', 'roleId' : 'role3', 'children' : [
          { 'roleName' : 'subGuest1', 'roleId' : 'role11', 'children' : [] },
          { 'roleName' : 'subGuest2', 'roleId' : 'role12', 'collapsed' : true, 'children' : [
            { 'roleName' : 'subGuest2-1', 'roleId' : 'role121', 'children' : [
              { 'roleName' : 'subGuest2-1-1', 'roleId' : 'role1211', 'children' : [] },
              { 'roleName' : 'subGuest2-1-2', 'roleId' : 'role1212', 'children' : [] }
            ]}
          ]}
        ]}
      ];

      
      
    //roleList1 to treeview
    $scope.roleList = $scope.roleList1;



	}
]);
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
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

// Gafxmls controller
angular.module('gafxmls').controller('GafxmlsController', ['$window', '$scope', '$stateParams', '$location', 'Authentication', 'Gafxmls', 'Gafglobals', '$modal', '$timeout', '$filter', '$rootScope',
	function($window, $scope, $stateParams, $location, Authentication, Gafxmls, Gafglobals, $modal, $timeout, $filter, $rootScope) {
		$scope.authentication = Authentication;
		$scope.gafxmldata = {};
		$scope.convertedXML = '';
		$scope.vendor = '';
		$scope.model = '';
		$scope.issue = '';
		$scope.version = '';
		$scope.currentRowData = {};
		$scope.currentlyEditing = [{editType:'EQ', allowed:false},{editType:'CC', allowed:false},{editType:'FT', allowed:false}];


		$scope.setEditType = function(editType, allowed){

			Gafglobals.setCurrentlyEditing(editType, allowed);			

		};

		$scope.getEditType = function(editType){
			
			var editAllowed = Gafglobals.getCurrentlyEditing(editType);
			return editAllowed ? 'edit':'read';

		};

		$scope.getEditAllowed = function(editType){

			if (editType === 'EQ'){
				if ($scope.gafxml){
					if ($scope.gafxml.eqEditUser){
						if($scope.gafxml.eqEditUser === $scope.authentication.user._id) return true;
						if($scope.gafxml.eqEditUser._id === $scope.authentication.user._id) return true;
					}
				}
			}
			if (editType === 'CC'){
				if ($scope.gafxml){
					if ($scope.gafxml.ccEditUser){
						if($scope.gafxml.ccEditUser === $scope.authentication.user._id) return true;
						if($scope.gafxml.ccEditUser._id === $scope.authentication.user._id) return true;
					}
				}
			}
			if (editType === 'FT'){
				if ($scope.gafxml){
					if ($scope.gafxml.ftEditUser){
						if($scope.gafxml.ftEditUser === $scope.authentication.user._id) return true;
						if($scope.gafxml.ftEditUser._id === $scope.authentication.user._id) return true;
					}
				}
			}

			// return Gafglobals.getCurrentlyEditing(editType);
			return false;

		};

		$scope.getEditColor = function(){
			
			$scope.currentlyEditing = Gafglobals.getCurrentlyEditing();
			
			switch($scope.currentlyEditing){
          		case 'EQ':

	          		return 'text-info';
	          	case 'CC':
	          		return 'text-success';
	          	case 'FT':
	          		return 'text-warning';
	        }

			return $scope.currentlyEditing;

		};

		$scope.checkDeleteAllow = function(){
			if (!$scope.gafxml) return false;
			if ($scope.gafxml.freezeDocUser) return false;
			if ($scope.authentication.user){
				if (! $scope.gafxml.eqEditUser && !$scope.gafxml.ccEditUser && !$scope.gafxml.ftEditUser){
					return true;
				}
			}
			return false;
		};

		$scope.checkEditAllow = function(){
			if (!$scope.gafxml) return false;
			if ($scope.gafxml.freezeDocUser) return false;
			if ($scope.authentication.user){
				if ($scope.gafxml.eqEditUser){
					if ($scope.authentication.user._id === $scope.gafxml.eqEditUser) return true;
					if ($scope.authentication.user._id === $scope.gafxml.eqEditUser._id) return true;
				}
				if ($scope.gafxml.ccEditUser){
					if ($scope.authentication.user._id === $scope.gafxml.ccEditUser) return true;
					if ($scope.authentication.user._id === $scope.gafxml.ccEditUser._id) return true;
				}
				if ($scope.gafxml.ftEditUser){
					if ($scope.authentication.user._id === $scope.gafxml.ftEditUser) return true;
					if ($scope.authentication.user._id === $scope.gafxml.ftEditUser._id) return true;
				}
				if (!$scope.gafxml.eqEditUser || !$scope.gafxml.ccEditUser || !$scope.gafxml.ftEditUser) return true;

			}
			return false;
		};

		$scope.checkFreezeAllow = function(){
			if (!$scope.gafxml) return false;
			if ($scope.gafxml.freezeDocUser) return false;
			if ($scope.authentication.user){
				if (! $scope.gafxml.eqEditUser && !$scope.gafxml.ccEditUser && !$scope.gafxml.ftEditUser){
					return true;
				}
			}
			return false;
		};

		
		// var gafXmlGlobal=Gafglobals.getGafGlobals();
		// $scope.gafxmlXSD = gafXmlGlobal.gafxmlXSD;
	 //    $scope.gafxmlTables = gafXmlGlobal.gafxmlTables;
	 //    $scope.gafxmlNameMappings = gafXmlGlobal.gafxmlNameMappings;
	 //    $scope.gafxmlTypes = gafXmlGlobal.gafxmlTypes;
	 //    $scope.currentTable = {};
	 //    $scope.screenData = Gafglobals.getScreenDataStructure();
	 //    $scope.readWrite = '';
	 //    $scope.unsaved = false;

		function initScope(){
			var gafXmlGlobal=Gafglobals.getGafGlobals();
			$scope.gafxmlXSD = gafXmlGlobal.gafxmlXSD;
		    $scope.gafxmlTables = gafXmlGlobal.gafxmlTables;
		    $scope.gafxmlNameMappings = gafXmlGlobal.gafxmlNameMappings;
		    $scope.gafxmlTypes = gafXmlGlobal.gafxmlTypes;
		    $scope.currentTable = {};
		    $scope.screenData = Gafglobals.getScreenDataStructure();
		    $scope.readWrite = '';
		    $scope.unsaved = false;
		    $scope.scriptChanged = false;
			$scope.currentlyEditing = $scope.currentlyEditing === undefined ? '' :  $scope.currentlyEditing;

		}

		$scope.$watch(
	            'scriptChanged',
	            function( newValue, oldValue ) {
	                // Ignore initial setup.
	                 Gafglobals.setGafScriptChanged(newValue);
	            }
	    );



		$rootScope.$watch(
	            'doDocSave',
	            function( newValue, oldValue ) {
	                // Ignore initial setup.
	                 console.log('rootscope doDocsave');
	                 if ($rootScope.doDocSave && $scope.scriptChanged){
	                 	$scope.update();
	                 }

	            }
	    );

		$scope.prepareDownload = function(){
			
			setDBData();
			var gafxml = JSON.stringify($scope.gafxml.tables);
			var blob = new Blob([ gafxml ], { type : 'text/json' });
			$scope.downloadurl = (window.URL || window.webkitURL).createObjectURL( blob );

		};

		$scope.showContent = function($fileContent){
		    $scope.gafxmlContent = $fileContent;
		};

	    $scope.uploadDocument = function(){
	    	var uploadTables = JSON.parse($scope.gafxmlContent);

	    	for (var i=0, ilen=uploadTables.length; i < ilen; i++){
				for (var j=0, jlen=$scope.screenData.length; j < jlen; j++){
					if ($scope.screenData[j].$.name===uploadTables[i].table._name){
						$scope.screenData[j].data = angular.copy(uploadTables[i].table.data);
						$scope.screenData[j].$.description = uploadTables[i].table._description;
						if (uploadTables[i].table.hasOwnProperty('img')){
							$scope.screenData[j].$.img = uploadTables[i].table.img;
						}
						if (uploadTables[i].table.hasOwnProperty('rowStatus')){
							$scope.screenData[j].$.rowStatus = uploadTables[i].table.rowStatus;
						}

						break;
					}
				}
			}

	    	$scope.update();
	    };

	    $scope.xmlPublished = '';

	    $scope.publishXML = function(publishFormData){
	    	// $scope.gafxml.tables = JSON.parse($scope.gafxmlContent);
	    	$scope.xmlPublished = 'Central Appendix being published. Please wait....';

	    	var xmlData = $scope.getXML();
	    	var userInfo = {'author':$scope.authentication.user.displayName, 'authorComments':publishFormData.authorComments, 'release':publishFormData.release, 'vendor':$scope.vendor, 'model':$scope.model, 'issue':$scope.issue, 'version':$scope.version};
	    	
			// var tableInfo = {'tableName':'table1'};
			// var xmldata = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="ngdm_send" id="20" inline="true" x="-196" y="6"><mutation children="5"/><value name="CMD1"><block type="text" id="24"><field name="TEXT">ENT-OC3::</field></block></value><value name="CMD2"><block type="transport_reserved" id="25" inline="false"><field name="reserved_list">devcd</field></block></value><value name="CMD3"><block type="text" id="26"><field name="TEXT">::</field></block></value><value name="CMD4"><block type="ngdm_optional" id="27" inline="true"><mutation children="2"/><value name="OPT1"><block type="transport_parameters" id="28" inline="false"><field name="parm_list">eqp_state</field></block></value></block></value><next><block type="ngdm_resp" id="30" inline="false"><value name="RESP"><block type="text" id="31"><field name="TEXT">COMPLD</field></block></value><next><block type="ngdm_resp" id="32" inline="false"><value name="RESP"><block type="text" id="34"><field name="TEXT">IEAE</field></block></value><next><block type="ngdm_sleep" id="7" inline="true"><value name="SECONDS"><block type="math_number" id="8"><field name="NUM">5</field></block></value><next><block type="ngdm_send" id="9" inline="true"><mutation children="3"/><value name="CMD1"><block type="text" id="13"><field name="TEXT">DLT-OC3::</field></block></value><value name="CMD2"><block type="transport_reserved" id="35" inline="false"><field name="reserved_list">devcd</field></block></value><next><block type="ngdm_resp" id="36" inline="false"><value name="RESP"><block type="text" id="37"><field name="TEXT">COMPLD</field></block></value></block></next></block></next></block></next></block></next></block></next></block></xml>';
			// var publishdata = {tabList:xmlData.tabList, xml:xmldata};
			var gafxml = new Gafxmls (xmlData);
			// var gafxml = new Gafxmls (publishdata);

			gafxml.$publishXML(userInfo, function(resp) {
				// $location.path('gafxmls/' + gafxml._id);
				console.log('Document published...');
				console.log(resp);
				$scope.publishUpdate();
				$scope.convertedXML = '';
				$scope.xmlPublished = 'Central Appendix published:: ' + resp.author + ' | ' + resp.authorComments;
				if (resp.errors){
					$scope.xmlPublished = 'Central Appendix published:: ' + resp.author + ' | ' + resp.authorComments + resp.errors;
				}
				// $scope.scriptChanged = false;
				// $scope.openSaveAck('sm');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.errors;
				$scope.xmlPublished = 'Central Appendix publish Failed!! ' + errorResponse.data.errors;
			});
	    };



	    $scope.openPublishXML = function (size) {

		    var modalDeleteConfirm = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'publishXML.html',
      		  controller: 'PublishXMLController',
		      size: size,
			  backdrop: 'static',
		      resolve: {
		        checkin: function () {
		          return $scope.publishXML;
		        }
		      }
		    });
		};

	    $scope.showModel = function(table){

	    	for (var t=0, tlen=$scope.screenData.length; t < tlen; t++){
	    		
	    		if ($scope.screenData[t].$.name === table.$.name){

	    			$window.alert(JSON.stringify($scope.screenData[t].data));
	    			break;

	    		}
	    	}

	    };

	    $scope.setSample = function(){

	    	for (var t=0, tlen=$scope.screenData.length; t < tlen; t++){
	    		
	    		for (var rows=0; rows < 3; rows++){
		      		var dataItems = {};
		      		for (var j=0, jlen=$scope.screenData[t].column.length; j < jlen; j++){
		      		  var col = $scope.screenData[t].column[j];
			          dataItems[col.$.name] = 'init value' + j + '-' + rows;
			        }
		      		$scope.screenData[t].data[rows] = dataItems;	      	
			    }
	    	}

	    	

	    };


	    /*
	    //----------pagination begins   
          

	      $scope.gap = 5;

	      $scope.filteredItems = [];
	      $scope.groupedItems = [];
	      $scope.itemsPerPage = 5;
	      $scope.pagedItems = [];
	      $scope.currentPage = 0;


	      var searchMatch = function (haystack, needle) {
	          if (!needle) {
	              return true;
	          }
	          return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
	      };

	      // init the filtered items
	      $scope.search = function () {
	          $scope.filteredItems = $filter('filter')($scope.currentTable.data, function (item) {
	              for(var attr in item) {
	                  if (searchMatch(item[attr], $scope.query))
	                      return true;
	              }
	              return false;
	          });
	          // take care of the sorting order
	          if ($scope.sort.sortingOrder !== '') {
	              $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
	          }
	          $scope.currentPage = 0;
	          // now group by pages
	          $scope.groupToPages();
	      };
	      
	    
	      // calculate page in place
	      $scope.groupToPages = function () {
	          $scope.pagedItems = [];
	          
	          for (var i = 0; i < $scope.filteredItems.length; i++) {
	              if (i % $scope.itemsPerPage === 0) {
	                  $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
	              } else {
	                  $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
	              }
	          }
	      };
	      
	      $scope.range = function (size,start, end) {
	          var ret = [];        
	          console.log(size,start, end);
	                        
	          if (size < end) {
	              end = size;
	              start = size-$scope.gap;
	          }
	          for (var i = start; i < end; i++) {
	              ret.push(i);
	          }        
	           // console.log(ret);        
	          return ret;
	      };
	      
	      $scope.prevPage = function () {
	          if ($scope.currentPage > 0) {
	              $scope.currentPage--;
	          }
	      };
	      
	      $scope.nextPage = function () {
	          if ($scope.currentPage < $scope.pagedItems.length - 1) {
	              $scope.currentPage++;
	          }
	      };
	      
	      $scope.setPage = function () {
	          $scope.currentPage = this.n;
	      };

	      // functions have been describe process the data for display
	      // $scope.search();
	      

	    //----------pagination ends
	    */



	    $scope.openLoader = function (size, table) {

		    $scope.modalLoader = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'loader.html',
      		  controller: 'LoaderController',
		      size: size,
			  backdrop: 'static',
		      resolve: {
		        loaderCreated: function () {
		        	// $scope.setCurrentTable(table);
		          // $scope.closeLoader(table);
		        }
		      }
		    });

		    $timeout(function(){
		    	$scope.closeLoading(table);
		      }, 2000);
		};

		$scope.closeLoading = function(table){
			for (var nt=0, ntlen=$scope.screenData.length; nt < ntlen; nt++){
	    			if ($scope.screenData[nt].$.name === table.$.name){
	    				$scope.setCurrentTable($scope.screenData[nt]);
	    				break;
	    			}
		      		
	    	}
		};

	    $scope.closeLoader = function () {


		    if ($scope.modalLoader !== undefined) $scope.modalLoader.dismiss('cancel');
		};

	    function setTable(table){

	    	if (table.data !== undefined){
	    		for (var rows=0, rlen=table.data.length; rows < rlen; rows++){

				var dataItems = {};	    				
	      		var dbcol = table.data[rows];
	      		table.data[rows].rowIndex=rows;


			}
			$scope.currentTable = table;
	    	

	    	}
	    	/*for (var ct=0, ctlen=$scope.currentTable.data.length; ct < ctlen; ct++){
	    		$scope.currentTable.data[ct].rowIndex=ct;
	    	}*/
	    	$scope.maxRowIndex = 0;
	    	Gafglobals.setCurrentTable(table);	

	    	$timeout(function(){
		    	$scope.closeLoader();
		      }, 5000);

	    	
	    }

	    if (!$scope.gafxmlTables){
				initScope();
		}
		setTable($scope.gafxmlXSD.guiData.table[0]);

	    $scope.setCurrentTable = function(table){
	    	
	    	setTable(table);
	    };

	    $scope.getColumnHeaders = function(col){
	      return Gafglobals.getColumnHeaders(col);
	    };

	    $scope.getColumnDisplayType = function(col){
	      return Gafglobals.getColumnDisplayType(col);
	    };

	    $scope.getColInfo = function(col){
	      return Gafglobals.getColInfo(col);
	    };

	    // Create new Gafxml
		$scope.initScreenData = function() {
			// Create new Gafxml object
			// var gafxml = new Gafxmls ({
			// 	name: this.name
			// });

			for (var nt=0, ntlen=$scope.screenData.length; nt < ntlen; nt++){
	    			$scope.screenData[nt].data = [];		      		
	    	}
	    	for (var i=0, ilen=$scope.gafxmlXSD.guiData.table.length; i < ilen; i++){
				$scope.gafxmlXSD.guiData.table[i].data = [];
			}
		};


		// Create new Gafxml
		$scope.create = function() {
			// Create new Gafxml object
			// var gafxml = new Gafxmls ({
			// 	name: this.name
			// });

			var gafxml = new Gafxmls ({
				vendor: $scope.gafxml.vendor,
				model: $scope.gafxml.model,
				issue: $scope.gafxml.issue,
				version: $scope.gafxml.version
			});
			gafxml.tables=[];
			for (var nt=0, ntlen=$scope.screenData.length; nt < ntlen; nt++){
	    			gafxml.tables.push({});
    				gafxml.tables[nt].table={};
    				gafxml.tables[nt].table._displayName=$scope.screenData[nt].$.displayName;
    				gafxml.tables[nt].table._name=$scope.screenData[nt].$.name;
    				gafxml.tables[nt].table._number=$scope.screenData[nt].$.number;
    				gafxml.tables[nt].table._description=$scope.screenData[nt].$.description;
    				gafxml.tables[nt].table.data=[];
    				for (var nrows=0, nrlen=$scope.screenData[nt].data.length; nrows < nrlen; nrows++){

    					var newItems = {};	    				
			      		var newcol = $scope.screenData[nt].data[nrows];
			      		for (var nj=0, njlen=$scope.screenData[nt].column.length; nj < njlen; nj++){
			      		  var ncol = $scope.screenData[nt].column[nj];
				          // dataItems[col.$.name] = 'init value' + j + '-' + rows;
				          newItems[ncol.$.name] = newcol[ncol.$.name];
				        }
			      		gafxml.tables[nt].table.data.push(newItems);	      	

    				}
		      		
	    	}

			// Redirect after save
			gafxml.$save(function(response) {
				// $location.path('gafxmls/' + response._id);

				// Clear form fields
				
				$scope.scriptChanged = false;
				$scope.openSaveAck('sm');
				$location.path('/#!/gafxmls/edit');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	    $scope.openVMITool = function (size) {

		    var modalDeleteConfirm = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'vmiTool.html',
      		  controller: 'VMIToolController',
		      size: size,
			  backdrop: 'static',
              windowClass: 'vmi-modal-window',
		      resolve: {
		        getXML: function () {
		          return $scope.getXML;
		        }
		      }
		    });
		};

	    $scope.openTreeView = function (size) {

		    var modalDeleteConfirm = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'TreeView.html',
      		  controller: 'TreeViewController',
			  backdrop: 'static',
              windowClass: 'treeView-modal-window',
			  scope: $scope,
		      resolve: {
		        saveHierarchy: function () {
		          return $scope.saveHierarchy;
		        },
		        getHierarchy: function () {
		          return $scope.getHierarchy;
		        }
		      }
		    });
		};

		$scope.saveHierarchy = function(msg) {

				$scope.scriptChanged = true;			
	    		// $scope.currentTable.$.img=$scope.gafxml.vendor + '_' + $scope.gafxml.model + '_' + $scope.gafxml.issue + '_' + $scope.gafxml.version + '.png';

	    		var imageForm=	{
									imageName: $scope.gafxml.vendor + '_' + $scope.gafxml.model + '_' + $scope.gafxml.issue + '_' + $scope.gafxml.version + '.png',
									imageData: msg
								};

				var gafxml = new Gafxmls (imageForm);
				
				gafxml.$publishImage(function(resp) {
					// $location.path('gafxmls/' + gafxml._id);
					console.log('Image published...');
					console.log(resp);
					$scope.xmlPublished = 'Hierarchy Image published successfully... ';
					$scope.currentTable.$.img=resp.imageFileURI;
					if (resp.errors){
						$scope.xmlPublished = 'Hierarchy Image publish failed...' + resp.error;
					}
				}, function(errorResponse) {
					$scope.error = errorResponse.data.errors;
					$scope.xmlPublished = 'Hierarchy Image publish Failed!! ' + errorResponse.data.errors;
				});

			    
			  
	    	
		};

		$scope.parentColumnData=[];
		$scope.childColumnData=[];
		$scope.hierarchyTitle='';

		$scope.containsHierarchy = function(table){

				if (table.hasOwnProperty('hierarchy')){

					$scope.parentColumnData=[];
					$scope.childColumnData=[];
					$scope.nodeColors=[];
					$scope.hierarchyTitle=table.hierarchy[0].$.title;
					var childColumn = table.hierarchy[0].$.childColumn;
					var parentColumn = table.hierarchy[0].$.parentColumn;

					for (var i=0, ilen=$scope.gafxmlXSD.guiData.table.length; i < ilen; i++){
						var tabInfo = $scope.gafxmlXSD.guiData.table[i];
						if (tabInfo.$.name === table.$.name){
							for (var j=0, jlen=table.data.length; j<jlen; j++){

								$scope.parentColumnData.push(table.data[j][parentColumn]);
								$scope.childColumnData.push(table.data[j][childColumn]);
								if (table.data[j].hasOwnProperty('rowStatus')){
									var rowStat = table.data[j].rowStatus;
									if (rowStat==='changed'){
										$scope.nodeColors.push('green');
									}else if(rowStat==='new'){
										$scope.nodeColors.push('blue');
									}else if(rowStat==='removed'){
										$scope.nodeColors.push('red');
									}else{
										$scope.nodeColors.push('grey');
									}

								}else{
									$scope.nodeColors.push('grey');
								}
								

							}
							break;
						}
					}


				}
				return table.hasOwnProperty('hierarchy');

		};

		$scope.getHierarchy = function(){

				var rootNode = $scope.gafxml.vendor + '-' + $scope.gafxml.model + '-' + $scope.gafxml.issue + '-' + $scope.gafxml.version;
				return {parents:$scope.parentColumnData, children:$scope.childColumnData, rootNode:rootNode, nodeColors:$scope.nodeColors};

		};

		$scope.getXML = function(){
			// $scope.generateXML();

			var tableList=[];

			for (var i=0, ilen=$scope.gafxmlXSD.guiData.table.length; i < ilen; i++){
				var tabInfo = $scope.gafxmlXSD.guiData.table[i];
				tableList.push({number:tabInfo.$.number,name:tabInfo.$.displayName,description:tabInfo.$.description});
			}

			// var strxml = unescape(encodeURIComponent($scope.convertedXML));

			// return {tabList:tableList, xml:strxml};
			return {tabList:tableList, xml:$scope.convertedXML};

	        // while ($scope.convertedXML === '' || $scope.convertedXML === undefined){
	        // 	var testere='';
	        // }

	        // return $scope.convertedXML;
		};

	    $scope.openDeleteConfirm = function (size) {

		    var modalDeleteConfirm = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'deleteConfirm.html',
      		  controller: 'DeleteController',
		      size: size,
			  backdrop: 'static',
		      resolve: {
		        remove: function () {
		          return $scope.remove;
		        }
		      }
		    });
		};

		$scope.saveAckStatus = 'Please wait saving record...';
	    $scope.openSaveAck = function (size) {

		    var modalDeleteConfirm = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'saveAck.html',
      		  controller: 'SaveAckController',
		      size: size,
			  backdrop: 'static',
			  scope: $scope,
		      resolve: {
		        findOne: function () {
		          return $scope.findOne;
		        }
		      }
		    });
		};

	    $scope.openBlocklyEditor = function (size) {

		    var modalDeleteConfirm = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'blocklyEditor.html',
      		  controller: 'BlocklyController',
			  backdrop: 'static',
              windowClass: 'app-modal-window',
		      resolve: {
		        saveScript: function () {
		          return $scope.saveScript;
		        },
		        getScript: function () {
		          return $scope.getScript;
		        }
		      }
		    });
		};

		$scope.setBlocklyRowCol = function(row, col, scr){
			$scope.currentRow=row;
			$scope.currentColumn=col;
			$scope.currentScript=scr;
		};

		// save blockly script
		$scope.getScript = function(msg) {

			var blockInfo = $scope.getColInfo($scope.currentColumn);
			var valueRow = $scope.currentTable.data[$scope.currentRow];
			var varlist = [], taglist=[], positionalParmList=[], tagparmlist=[], dialoglist=[];
			var colName='', matchColName='',tblName='', blocklyTitle='';
			var tableType = $scope.currentTable.$.tableType;
			var tableName = $scope.currentTable.$.name;

			blocklyTitle= tableType + ' - ';

			for (var x=0, xlen=$scope.currentTable.column.length; x < xlen; x++){
				var xcol = $scope.currentTable.column[x];
				if (xcol.$.name !== $scope.currentColumn){

					var xval = valueRow[xcol.$.name];

					if (angular.isArray(xval)){
						for (var y=0;y<xval.length;y++){

							blocklyTitle += ' - ' + JSON.stringify(xval[y].item);

						}
					}else if(xval !== undefined){
						blocklyTitle += ' - ' + JSON.stringify(xval);
					}
					
				}
			}
			for (var v=0, vlen=blockInfo.varTable.length;v<vlen;v++){
				var whereCols=[], equalsCols=[],segments=[];
				var segInfo={}, segPrefix=[];
				colName=blockInfo.varTable[v].colName;
				tblName=blockInfo.varTable[v].tblName;
				if (blockInfo.varTable[v].hasOwnProperty('varMatchColumn')){
					matchColName = blockInfo.varTable[v].varMatchColumn;
				}

				segInfo = checkForSegments(colName, tblName);
				segments = segInfo.segs;
				segPrefix = segInfo;


				/*---storing all the whereCols of script Table i.e $scope.currentTable and equalCols of var Table
	          	*/

	          	if (blockInfo.varTable[v].filter !== undefined){
					for (var f=0,flen=blockInfo.varTable[v].filter.length;f<flen;f++){
						try{
							whereCols.push(blockInfo.varTable[v].filter[f].$.whereTableColName);
							equalsCols.push(blockInfo.varTable[v].filter[f].$.equalsVarTableColName);						
						}catch(err){
							whereCols=[];
							equalsCols=[];
						}
					}
				}

				/*---looping thru all tables to find the varTable that is defined in tblName
	          	*/
				for (var i=0, ilen=$scope.gafxmlXSD.guiData.table.length; i < ilen; i++){
					if ($scope.gafxmlXSD.guiData.table[i].$.name===tblName){
						/*storing the data for the varTable
			          	*/
						var varTableData = $scope.gafxmlXSD.guiData.table[i].data;

						for (var d=0,dlen=varTableData.length;d<dlen;d++){

							var dbcol = varTableData[d];
							// $scope.blocklyTitle = dbcol[colName];
				      		for (var j=0, jlen=$scope.gafxmlXSD.guiData.table[i].column.length; j < jlen; j++){
				      		  var col = $scope.gafxmlXSD.guiData.table[i].column[j];

					          try{
					          	/*---checking if the conditions for varTable matches the ones in the script table
					          	..eg devcd = devcd and action = action
					          	*/
					          	var okToPush = [];	//array to check each condition mentioned in the <filter>, even if one condition is false the item is not added to array				          	
					          	var pushtoArray = false; // checks for individual condition in the <filter>
					          	if (equalsCols.length === 0){okToPush[okToPush.length] = true; pushtoArray=true;}

					          	for (var we=0,welen=equalsCols.length;we<welen;we++){

					          		/**************/

					          		if (okToPush.length===0){
					          			var nothing_to_do=true;
					          		} else {
					          			var broken = false;
					          			for (var okp=0; okp < okToPush.length; okp++){
					          				if (okToPush[okp] === false){
					          					broken = true;
					          					break;
					          				}
					          			}
					          			if (broken) break;
					          		}

					          		var equalVal = dbcol[equalsCols[we]],  whereVal = valueRow[whereCols[we]];

					          		if (whereVal === undefined || equalVal === undefined){
					          			okToPush[okToPush.length] = false;
					          		}else if (angular.isArray(equalVal)){
					          			if (angular.isArray(whereVal)){
					          				for (var ev=0, evl=equalVal.length; ev<evl; ev++){
					          					var broken2 = false;
					          					for (var wv=0, wvl=whereVal.length; wv<wvl; wv++){
					          						if (equalVal[ev].item === whereVal[wv].item){
							          					okToPush[okToPush.length] = true;
							          					pushtoArray = true;
							          					broken2 = true;
							          					break;
							          				}
					          					}
					          					if (broken2) break;
					          				}


					          			}else{
					          				for (var ev2=0, evl2=equalVal.length; ev2<evl2; ev2++){
					          					if (equalVal[ev2].item === whereVal.item){
							          					okToPush[okToPush.length] = true;
							          					pushtoArray = true;
							          					break;
					          					}
					          				}
					          			}
					          		}else {
					          			if (angular.isArray(whereVal)){
					          				for (var wv2=0, wvl2=whereVal.length; wv2<wvl2; wv2++){
					          						if (equalVal.item === whereVal[wv2].item){
							          					okToPush[okToPush.length] = true;
							          					pushtoArray = true;
							          					break;
							          				}
					          				}


					          			}else {
					          				if (equalVal === whereVal){
							          					okToPush[okToPush.length] = true;
							          					pushtoArray = true;
							          		}
					          			}
					          		}
						          	if (!pushtoArray){
						          		okToPush[okToPush.length]=false;
						          	}

					          		/****************/


					          	}
			          			for (var okp2=0; okp2 < okToPush.length; okp2++){
			          				if (okToPush[okp2] === false){
			          					pushtoArray = false;
			          					break;
			          				}
			          			}
					          	if (pushtoArray){

					          		var varData = [];

					          		switch(blockInfo.varTable[v].storageType){
						          		case 'NEPARM':

							          		for (var vl=0,vllen=varlist.length;vl<vllen;vl++){
							          			if (varlist[vl].indexOf(dbcol[colName]) >=0){
							          				pushtoArray=false;
							          				break;
							          			}
							          		}
							          		break;
							          	case 'TAG':

							          		for (var tl=0,tllen=taglist.length;tl<tllen;tl++){
							          			if (taglist[tl].indexOf(dbcol[colName]) >=0){
							          				pushtoArray=false;
							          				break;
							          			}
							          		}
							          		break;
							          	case 'TAG=NEPARM':

							          		if (dbcol[matchColName] !== '' || dbcol[matchColName] !== undefined){
							          			
								          		for (var tnl=0,tnllen=tagparmlist.length;tnl<tnllen;tnl++){
								          			if (tagparmlist[tnl].indexOf(dbcol[colName]) >=0){
								          				pushtoArray=false;
								          				break;
								          			}
								          		}
							          		}else{

								          		for (var pl=0,pllen=positionalParmList.length;pl<pllen;pl++){
								          			if (positionalParmList[pl].indexOf(dbcol[colName]) >=0){
								          				pushtoArray=false;
								          				break;
								          			}
								          		}

							          		}
							          		break;
							          	case 'DIALOG':
							          		okToPush=true;
								          	break;
					          		}
					          		if (pushtoArray) {

						          		switch(blockInfo.varTable[v].storageType){
							          		case 'NEPARM':
							          			varData.push((dbcol[colName]===undefined) ? '':dbcol[colName]);
							          			varData.push((dbcol[colName]===undefined) ? '':dbcol[colName]);
							          			varlist.push(varData);
						          			
							          			for (var sg=0;sg<segments.length;sg++){
							          				var slst=[];
							          				// slst.push(segPrefix + sg);
							          				// slst.push(segPrefix + sg);
							          				slst.push(segments[sg]);
							          				slst.push(segments[sg]);
							          				if (!findInArray(varlist,slst)) varlist.push(slst);
							          			}
							          			break;
							          		case 'TAG':
							          			varData.push((dbcol[colName]===undefined) ? '':dbcol[colName].toLowerCase());
							          			varData.push((dbcol[colName]===undefined) ? '':dbcol[colName].toLowerCase());
							          			taglist.push(varData);
						          			
							          			for (var tg=0;tg<segments.length;tg++){
							          				var tlst=[];
							          				// tlst.push(segPrefix + tg);
							          				// tlst.push(segPrefix + tg);
							          				tlst.push(segments[tg]);
							          				tlst.push(segments[tg]);
							          				if (!findInArray(taglist,tlst)) taglist.push(tlst);
							          			}
							          			break;
							          		case 'TAG=NEPARM':
							          			varData.push((dbcol[colName]===undefined) ? '':dbcol[colName].toLowerCase());
							          			if ((dbcol[matchColName] !== '' && dbcol[matchColName] !== undefined) && (dbcol[colName] !== '' && dbcol[colName] !== undefined)){
							          				// varData.push((dbcol[colName]===undefined) ? '':dbcol[matchColName].toLowerCase() + '=' + dbcol[colName]);
							          				varData.push((dbcol[colName]===undefined) ? '':dbcol[matchColName] + '=' + dbcol[colName]);
							          				tagparmlist.push(varData);
						          			
								          			for (var tng=0;tng<segments.length;tng++){
								          				var tnlst=[];
								          				// tnlst.push(segPrefix + tng);
								          				// tnlst.push(segPrefix + tng);
								          				tnlst.push(segments[tng]);
							          					tnlst.push(segments[tng]);
								          				if (!findInArray(tagparmlist,tnlst)) tagparmlist.push(tnlst);
								          			}
							          			}else{
							          				varData.push((dbcol[colName]===undefined) ? '':dbcol[colName].toLowerCase());
							          			
								          			if (!findInArray(positionalParmList,varData)) positionalParmList.push(varData);
								          			// positionalParmList.push(varData);
							          			
								          			for (var pg=0;pg<segments.length;pg++){
								          				var plst=[];
								          				// plst.push(segPrefix + pg);
								          				// plst.push(segPrefix + pg);
								          				plst.push(segments[pg]);
							          					plst.push(segments[pg]);
								          				if (!findInArray(positionalParmList,plst)) positionalParmList.push(plst);
								          			}
							          			}
							          			break;
							          		case 'DIALOG':
							          			varData.push((dbcol[colName]===undefined) ? '':dbcol[colName]);
							          			varData.push((dbcol[colName]===undefined) ? '':dbcol[colName]);
							          			dialoglist.push(varData);
							          			break;
							          	}
					          		}
						          	break;
					          	}
					          	
					          }catch(err){
					          	console.log(err);
					          }
					          
					        }

						}

						break;

					}
				}
			}

			var editMode = false;

			if ($scope.readWrite === 'edit'){
				editMode = true;
			}else{
				editMode = false;
			}


			var scriptInfo = {dlgTitle:blocklyTitle, blockEditable:editMode, vars:varlist, tags:taglist, tagParm:tagparmlist, posParm:positionalParmList, dialogs:dialoglist, scripts:$scope.currentScript, editMode:editMode, tableType:tableType, tableName:tableName};
			// return $scope.currentScript;
			return scriptInfo;
		};

		function checkForSegments(icol, itbl){
			var segments=[], segparms=[];
			var cfound=false;
			var segPrefix=[];

			for (var i=0, ilen=$scope.gafxmlXSD.guiData.table.length; i < ilen; i++){
				var tbl = $scope.gafxmlXSD.guiData.table[i];
				if (tbl.$.name === itbl){

					for (var j=0, jlen=tbl.column.length; j < jlen; j++){
						if (tbl.column[j].$.hasOwnProperty('isSegmented') && tbl.column[j].$.name===icol){
							segPrefix = tbl.column[j].$.segmentPrefix.split(',');
							for (var k=0,klen=tbl.data.length;k<klen;k++){

								var segs = tbl.data[k][icol];
								var slist=[];
								slist=segs.split('/');
								if (slist.length > segments.length){
									segments=[];
									segments=segs.split('/');
								}

								for (var sp=0; sp<segPrefix.length; sp++){

									for (var sg=0; sg<segments.length;sg++){
										segparms[segparms.length]=segPrefix[sp] + (sg+1);
									}

								}



							}
							cfound=true;
							break;
						}
					}

				}
				if (cfound) break;
			} 
			return {prefix:segPrefix, segs:segparms};
		}

		function findInArray(searchlist, searchItem){
			var hash = {};
			for(var i = 0 ; i < searchlist.length; i += 1) {
			    hash[searchlist[i]] = i;
			}

			return hash.hasOwnProperty(searchItem);
		}

		$scope.getLookupData = function(srow, scol) {

			$scope.currentRow=srow;
			$scope.currentColumn=scol;

			var blockInfo = $scope.getColInfo($scope.currentColumn);
			var valueRow = $scope.currentTable.data[$scope.currentRow];
			var varlist = [];
			var colName='',tblName='', blocklyTitle='';

			for (var v=0, vlen=blockInfo.varTable.length;v<vlen;v++){
				var whereCols=[], equalsCols=[];
				colName=blockInfo.varTable[v].colName;
				tblName=blockInfo.varTable[v].tblName;

				/*---storing all the whereCols of script Table i.e $scope.currentTable and equalCols of var Table
	          	*/

	          	if (blockInfo.varTable[v].filter !== undefined){
					for (var f=0,flen=blockInfo.varTable[v].filter.length;f<flen;f++){
						try{
							whereCols.push(blockInfo.varTable[v].filter[f].$.whereTableColName);
							equalsCols.push(blockInfo.varTable[v].filter[f].$.equalsVarTableColName);						
						}catch(err){
							whereCols=[];
							equalsCols=[];
						}
					}
				}

				/*---looping thru all tables to find the varTable that is defined in tblName
	          	*/
				for (var i=0, ilen=$scope.gafxmlXSD.guiData.table.length; i < ilen; i++){
					if ($scope.gafxmlXSD.guiData.table[i].$.name===tblName){
						/*storing the data for the varTable
			          	*/
						var varTableData = $scope.gafxmlXSD.guiData.table[i].data;

						for (var d=0,dlen=varTableData.length;d<dlen;d++){

							var dbcol = varTableData[d];
							// $scope.blocklyTitle = dbcol[colName];
				      		for (var j=0, jlen=$scope.gafxmlXSD.guiData.table[i].column.length; j < jlen; j++){
				      		  var col = $scope.gafxmlXSD.guiData.table[i].column[j];

					          try{
					          	/*---checking if the conditions for varTable matches the ones in the script table
					          	..eg devcd = devcd and action = action
					          	*/
					          	var okToPush = false;
					          	if (equalsCols.length === 0){okToPush = true;}

					          	for (var we=0,welen=equalsCols.length;we<welen;we++){

					          		var equalVal = JSON.stringify(dbcol[equalsCols[we]]);
					          		var whereVal = JSON.stringify(valueRow[whereCols[we]]);

					          		if(angular.isArray(dbcol[equalsCols[we]]) && angular.isArray(valueRow[whereCols[we]])){
					          			for (var eqv1=0,eqvlen1=dbcol[equalsCols[we]].length;eqv1<eqvlen1; eqv1++){
					          				for (var whv=0,whvlen=valueRow[whereCols[we]].length;whv<whvlen; whv++){
						          				if (valueRow[whereCols[we]][whv].item === dbcol[equalsCols[we]][eqv1].item){
						          					okToPush = true;
						          					break;
						          				}

					          				}
					          				if (okToPush) break;
					          			}
					          			if (okToPush) break;

					          		}else if (angular.isArray(dbcol[equalsCols[we]])){
					          			for (var eqv2=0,eqvlen2=dbcol[equalsCols[we]].length;eqv2<eqvlen2; eqv2++){
					          				if (dbcol[equalsCols[we]][eqv2].item === whereVal){
					          					okToPush = true;
					          					break;
					          				}
					          			}
					          			if (okToPush) break;
					          		}else if(angular.isArray(valueRow[whereCols[we]])){

					          			for (var eqv=0,eqvlen=valueRow[whereCols[we]].length;eqv<eqvlen; eqv++){
					          				if (valueRow[whereCols[we]][eqv].item === equalVal){
					          					okToPush = true;
					          					break;
					          				}
					          			}
					          			if (okToPush) break;

					          		}else {
					          			if ( equalVal.indexOf(whereVal) > -1){

							          		okToPush = true;
							          		
							          	}else{

							          		okToPush = false;
							          		break;

							          	}

					          		}


						          	// if ( equalVal.search(/\swhereVal\s/) > -1){
						          	


					          	}
					          	if (okToPush){

					          		// var varData = [];

					          		/*for (var vl=0,vllen=varlist.length;vl<vllen;vl++){
					          			if (angular.isArray(varlist[vl].value)){

					          			}
					          			if (varlist[vl].value.indexOf(dbcol[colName].toLowerCase()) >=0){
					          				okToPush=false;
					          				break;
					          			}
					          		}*/

					          		if (okToPush) {

						          		// varData.push({'value':dbcol[colName]});
						          		// varData.push({'text':dbcol[colName]});
					          			varlist.push({'value':dbcol[colName],'text':dbcol[colName]});
					          		}
						          	break;
					          	}
					          	
					          }catch(err){
					          	console.log(err);
					          }
					          
					        }

						}

						break;

					}
				}
			}

			return varlist;
		};

		// save blockly script
		$scope.saveScript = function(msg) {

				$scope.scriptChanged = true;			
	    		$scope.currentTable.data[$scope.currentRow][$scope.currentColumn]=msg;
	    	
		};

		// save blockly script
		$scope.change = function() {

			$scope.unsaved = true;
			$window.alert('changed...');
			//
		};

		// Remove existing Gafxml
		$scope.remove = function(gafxml) {

			
			if ( gafxml ) { 
				gafxml.$remove();

				for (var i in $scope.gafxmls) {
					if ($scope.gafxmls [i] === gafxml) {
						$scope.gafxmls.splice(i, 1);
					}
				}
			} else {
				$scope.gafxml.$remove(function() {
					$location.path('gafxmls');
				});
			}
		};

		// Update existing Gafxml
		$scope.update = function() {
			$scope.saveAckStatus = 'Please wait...';
			$scope.openSaveAck('sm');
			setDBData();
			var gafxml = $scope.gafxml;

			gafxml.$update(function(result) {
				// $location.path('gafxmls/' + gafxml._id);
				console.log('Document updated...');
				$scope.scriptChanged = false;
				$scope.saveAckStatus = 'Saved successfully!';
				// $scope.openSaveAck('sm');

				/*
				$scope.setEditType('EQ', $scope.currentlyEditing[0].allowed);
				$scope.setEditType('CC', $scope.currentlyEditing[1].allowed);
				$scope.setEditType('FT', $scope.currentlyEditing[2].allowed);
				*/
				// $location.path('gafxmls/' + gafxml._id + '/edit');
				
				$scope.gafxml = result;

				setTableData($scope.gafxml.tables);
				for (var ct=0, ctlen=$scope.gafxmlXSD.guiData.table.length; ct<ctlen; ct++){
					if ($scope.gafxmlXSD.guiData.table[ct].$.name === $scope.currentTable.$.name){
						$scope.setCurrentTable($scope.gafxmlXSD.guiData.table[ct]);
						break;
					}
				}
				$scope.scriptChanged = false;



				for (var ed=0; ed < $scope.currentlyEditing.length; ed++){
					if ($scope.currentlyEditing[ed].editType === 'EQ' && $scope.gafxml.eqEditUser){
						Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
					}else{
						Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
					}
					if ($scope.currentlyEditing[ed].editType === 'CC' && $scope.gafxml.ccEditUser){
						Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
					}else{
						Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
					}
					if ($scope.currentlyEditing[ed].editType === 'FT' && $scope.gafxml.ftEditUser){
						Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
					}else{
						Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
					}
				}
			}, function(errorResponse) {
				$scope.saveAckStatus = 'Saved Unsuccessfully!';
				$scope.error = errorResponse.data.message;
			});
		};

		// Save a copy existing Gafxml
		$scope.saveCopy = function() {
			var vn = $scope.version.charCodeAt(0);
			vn += 1;
			var newgafxml = new Gafxmls ({
				vendor: $scope.vendor,
				model: $scope.model,
				issue: $scope.issue,
				version: String.fromCharCode(vn)
			});
			newgafxml.tables=[];
			for (var nt=0, ntlen=$scope.screenData.length; nt < ntlen; nt++){
	    			newgafxml.tables.push({});
    				newgafxml.tables[nt].table={};
    				newgafxml.tables[nt].table._displayName=$scope.screenData[nt].$.displayName;
    				newgafxml.tables[nt].table._name=$scope.screenData[nt].$.name;
    				newgafxml.tables[nt].table._number=$scope.screenData[nt].$.number;
    				newgafxml.tables[nt].table._description=$scope.screenData[nt].$.description;

    				newgafxml.tables[nt].table.data=[];
    				for (var nrows=0, nrlen=$scope.screenData[nt].data.length; nrows < nrlen; nrows++){

    					var newItems = {};	    				
			      		var newcol = $scope.screenData[nt].data[nrows];
			      		for (var nj=0, njlen=$scope.screenData[nt].column.length; nj < njlen; nj++){
			      		  var ncol = $scope.screenData[nt].column[nj];
				          // dataItems[col.$.name] = 'init value' + j + '-' + rows;
				          if (ncol.$.name==='rowStatus') continue;
				          newItems[ncol.$.name] = newcol[ncol.$.name];
				        }
			      		newgafxml.tables[nt].table.data.push(newItems);	      	

    				}
		      		
	    	}

	    	// Redirect after save
			newgafxml.$save(function(response) {
				// $location.path('gafxmls/' + response._id);
				$location.path('/#!/gafxmls/edit');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		function setTableData(tableList){

			// $scope.screenData = [];
			// $scope.screenData = Gafglobals.getScreenDataStructure();

			for (var t=0, tlen=$scope.screenData.length; t < tlen; t++){
	    		
	    		for (var tabs=0, tablen=tableList.length; tabs < tablen; tabs++){
	    			if ($scope.screenData[t].$.name === tableList[tabs].table._name){
	    				$scope.screenData[t].data=[];
	    				for (var rows=0, rlen=tableList[tabs].table.data.length; rows < rlen; rows++){

	    					var dataItems = {};	    				
				      		var dbcol = tableList[tabs].table.data[rows];
				      		for (var j=0, jlen=$scope.screenData[t].column.length; j < jlen; j++){
				      		  var col = $scope.screenData[t].column[j];
					          // dataItems[col.$.name] = 'init value' + j + '-' + rows;
					          	dataItems[col.$.name] = dbcol[col.$.name];					          	
					        }
				      		$scope.screenData[t].data[rows] = dataItems;
				      		$scope.screenData[t].data[rows].rowIndex=rows;


	    				}
	    				
	    				break;
	    			}
		      		
			    }
	    	}
	    }

	    function setDBData(){
	    	var all_tabs=[];
	    	for (var t=0, tlen=$scope.screenData.length; t < tlen; t++){
	    		all_tabs.push($scope.screenData[t].$.name);
	    		for (var tabs=0, tablen=$scope.gafxml.tables.length; tabs < tablen; tabs++){
	    			if ($scope.screenData[t].$.name === $scope.gafxml.tables[tabs].table._name){
	    				all_tabs[t] = '';
	    				$scope.gafxml.tables[tabs].table.data = [];
	    				for (var rows=0, rlen=$scope.screenData[t].data.length; rows < rlen; rows++){

	    					var dataItems = {};	    				
				      		var dbcol = $scope.screenData[t].data[rows];
				      		for (var j=0, jlen=$scope.screenData[t].column.length; j < jlen; j++){
				      		  var col = $scope.screenData[t].column[j];
					          // dataItems[col.$.name] = 'init value' + j + '-' + rows;
					          try{
					          	dataItems[col.$.name] = dbcol[col.$.name];
					          }catch(err){
					          	console.log($scope.gafxml.tables[tabs]);
					          	console.log(err);
					          }
					          
					        }
				      		$scope.gafxml.tables[tabs].table.data[rows] = dataItems;
				      		$scope.gafxml.tables[tabs].table._description=$scope.screenData[t].$.description;
				      		$scope.gafxml.tables[tabs].table._tableCategory=$scope.screenData[t].$.tableType;
				      		if ($scope.screenData[t].$.hasOwnProperty('img')){
				      			$scope.gafxml.tables[tabs].table.img=$scope.screenData[t].$.img;
				      		}

	    				}
	    				

	    			}
		      		
			    }
	    	}
	    	for (var nt=0, ntlen=$scope.screenData.length; nt < ntlen; nt++){
	    		// for (var ntabs=0, ntablen=$scope.gafxml.tables.length; ntabs < ntablen; ntabs++){
	    			if (all_tabs[nt] !== ''){
	    				$scope.gafxml.tables.push({});
	    				$scope.gafxml.tables[$scope.gafxml.tables.length-1].table={};
	    				$scope.gafxml.tables[$scope.gafxml.tables.length-1].table._displayName=$scope.screenData[nt].$.displayName;
	    				$scope.gafxml.tables[$scope.gafxml.tables.length-1].table._name=$scope.screenData[nt].$.name;
	    				$scope.gafxml.tables[$scope.gafxml.tables.length-1].table._number=$scope.screenData[nt].$.number;
	    				$scope.gafxml.tables[$scope.gafxml.tables.length-1].table._description=$scope.screenData[nt].$.description;
	    				$scope.gafxml.tables[$scope.gafxml.tables.length-1].table._tableCategory=$scope.screenData[nt].$.tableType;
			      		if ($scope.screenData[nt].$.hasOwnProperty('img')){
			      			$scope.gafxml.tables[$scope.gafxml.tables.length-1].table.img=$scope.screenData[nt].$.img;
			      		}
	    				$scope.gafxml.tables[$scope.gafxml.tables.length-1].table.data=[];
	    				for (var nrows=0, nrlen=$scope.screenData[nt].data.length; nrows < nrlen; nrows++){

	    					var newItems = {};	    				
				      		var newcol = $scope.screenData[nt].data[nrows];
				      		for (var nj=0, njlen=$scope.screenData[nt].column.length; nj < njlen; nj++){
				      		  var ncol = $scope.screenData[nt].column[nj];
					          // dataItems[col.$.name] = 'init value' + j + '-' + rows;
					          newItems[ncol.$.name] = newcol[ncol.$.name];
					        }
				      		$scope.gafxml.tables[$scope.gafxml.tables.length-1].table.data.push(newItems);	      	

	    				}
	    				

	    			}
		      		
			    // }
	    	}

	    	for (var ed=0; ed < $scope.currentlyEditing.length; ed++){
				if ($scope.currentlyEditing[ed].editType === 'EQ'){
					if ($scope.currentlyEditing[ed].allowed){
						$scope.gafxml.eqEditUser = $scope.authentication.user._id;
					}else{
						$scope.gafxml.eqEditUser = undefined;
					}
				}
				if ($scope.currentlyEditing[ed].editType === 'CC'){
					if ($scope.currentlyEditing[ed].allowed){
						$scope.gafxml.ccEditUser = $scope.authentication.user._id;
					}else{
						$scope.gafxml.ccEditUser = undefined;
					}
				}
				if ($scope.currentlyEditing[ed].editType === 'FT'){
					if ($scope.currentlyEditing[ed].allowed){
						$scope.gafxml.ftEditUser = $scope.authentication.user._id;
					}else{
						$scope.gafxml.ftEditUser = undefined;
					}
				}
			}
	    }

		// Find a list of Gafxmls
		$scope.find = function() {
			// $scope.gafxmls = Gafxmls.query();

			if (!$scope.gafxmlTables){
				initScope();
			}

			if ($stateParams.gafxmlId){
				console.log('there is a opened document.' + $stateParams.gafxmlId);
			}

			Gafxmls.query(function(result){
				$scope.gafxmls = result;

				// setTableData($scope.gafxmls[0].tables);
			});


			
		};

		$scope.confirmClose = function(){

			var confm = $window.confirm('Are you sure you want to CLOSE the document?');

			if (confm){
				$scope.checkForOpen();
			}

		};

		$scope.checkForOpen = function(){

			if ($scope.gafxml){
				console.log('there is an open document');
				// if ($scope.authentication.user === $scope.gafxml.editUser || $scope.authentication.user._id === $scope.gafxml.editUser._id){
					var gafxml = $scope.gafxml;

					gafxml.$close(function(result) {
						// $location.path('/gafxmls' + gafxml._id);
						$scope.gafxml = result;
						for (var ed=0; ed < $scope.currentlyEditing.length; ed++){
							if ($scope.currentlyEditing[ed].editType === 'EQ' && $scope.gafxml.eqEditUser){
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
							}else{
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
							}
							if ($scope.currentlyEditing[ed].editType === 'CC' && $scope.gafxml.ccEditUser){
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
							}else{
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
							}
							if ($scope.currentlyEditing[ed].editType === 'FT' && $scope.gafxml.ftEditUser){
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
							}else{
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
							}
						}
						$location.path('/#!/');
						console.log('Document closing...');
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				// }
			}

		};

		$scope.confirmFreeze = function(){

			var confm = $window.confirm('Are you sure you want to FREEZE the document?');

			if (confm){
				$scope.FreezeDoc();
			}

		};

		$scope.FreezeDoc = function(){

			if ($scope.gafxml){
				console.log('there is an open document');
				// if ($scope.authentication.user === $scope.gafxml.editUser || $scope.authentication.user._id === $scope.gafxml.editUser._id){
					var gafxml = $scope.gafxml;

					gafxml.$freezeDoc(function(result) {
						// $location.path('/gafxmls' + gafxml._id);
						$scope.gafxml = result;
						
						$location.path('/#!/');
						console.log('Document freezing...');
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				// }
			}

		};

		$scope.publishUpdate = function(){

			if ($scope.gafxml){
				console.log('there is an open document');
				// if ($scope.authentication.user === $scope.gafxml.eqEditUser || $scope.authentication.user === $scope.gafxml.ccEditUser || ){
					var gafxml = $scope.gafxml;

					gafxml.$publish(function() {
						// $location.path('/gafxmls' + gafxml._id);
						// $location.path('/#!/');
						console.log('Document publshed...');
						$scope.convertedXML = '';
						$scope.xmlPublished = '';
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				// }
			}

		};

		$scope.editUpdate = function(){

			if ($scope.gafxml){
				console.log('edit document');

				var eqAllow = $scope.gafxml.eqEditUser===undefined ? false : $scope.authentication.user === $scope.gafxml.eqEditUser;
				var ccAllow = $scope.gafxml.ccEditUser===undefined ? false : $scope.authentication.user === $scope.gafxml.ccEditUser;
				var ftAllow = $scope.gafxml.ftEditUser===undefined ? false : $scope.authentication.user === $scope.gafxml.ftEditUser;
				if (eqAllow || ccAllow || ftAllow){
					var gafxml = $scope.gafxml;

					gafxml.$edit(function(result) {
						// $location.path('/gafxmls' + gafxml._id);
						// $location.path('/#!/');
						$scope.gafxml = result;
						for (var ed=0; ed < $scope.currentlyEditing.length; ed++){
							if ($scope.currentlyEditing[ed].editType === 'EQ' && $scope.gafxml.eqEditUser){
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
							}else{
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
							}
							if ($scope.currentlyEditing[ed].editType === 'CC' && $scope.gafxml.ccEditUser){
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
							}else{
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
							}
							if ($scope.currentlyEditing[ed].editType === 'FT' && $scope.gafxml.ftEditUser){
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, true);
							}else{
								Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, false);
							}
						}
						console.log('Document edited...');
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
			}

		};

		// Find existing Gafxml
		$scope.findOne = function() {

			if (!$scope.gafxmlTables){
				initScope();
			}

			Gafxmls.get({ 
				gafxmlId: $stateParams.gafxmlId
			}, function(result){
				$scope.gafxml = result;
				// setTableData($scope.gafxml.table);
				$scope.vendor = $scope.gafxml.vendor;
				$scope.model = $scope.gafxml.model;
				$scope.issue = $scope.gafxml.issue;
				$scope.version = $scope.gafxml.version;
				
				for (var i=0, ilen=$scope.gafxmlXSD.guiData.table.length; i < ilen; i++){
					for (var j=0, jlen=$scope.gafxml.tables.length; j < jlen; j++){
						if ($scope.gafxml.tables[j].table._name===$scope.gafxmlXSD.guiData.table[i].$.name){
							$scope.gafxmlXSD.guiData.table[i].data = $scope.gafxml.tables[j].table.data;
							$scope.gafxmlXSD.guiData.table[i].$.description = $scope.gafxml.tables[j].table._description;
							if ($scope.gafxml.tables[j].table.hasOwnProperty('img')){
								$scope.gafxmlXSD.guiData.table[i].$.img = $scope.gafxml.tables[j].table.img;
							}
							break;
						}
					}

					/*
					if (tabl === undefined){
						tabl = Gafglobals.getCurrentTable();
					}
						
					if ($scope.gafxmlXSD.guiData.table[i].$.name === tabl.$.name){
						
						tabl = $scope.gafxmlXSD.guiData.table[i];
					}*/
					
				}

				setTableData($scope.gafxml.tables);

				/*var tabl = Gafglobals.getCurrentTable();

				for (var nt=0, ntlen=$scope.screenData.length; nt < ntlen; nt++){
	    			if ($scope.screenData[nt].$.name === tabl.$.name){
	    				$scope.setCurrentTable($scope.screenData[nt]);
	    				break;
		    		}
			      		
		    	}*/

		    	

		    	var tabl = Gafglobals.getCurrentTable();

		    	console.log(tabl.$.name);

				for (var nt=0, ntlen=$scope.gafxmlXSD.guiData.table.length; nt < ntlen; nt++){
	    			if ($scope.gafxmlXSD.guiData.table[nt].$.name === tabl.$.name){
	    				$scope.setCurrentTable($scope.gafxmlXSD.guiData.table[nt]);
	    				break;
		    		}
			      		
		    	}

		    	
				
				/*if ($scope.currentTable !== undefined){

					
					$scope.setCurrentTable($scope.gafxmlXSD.guiData.table[0]);
				}*/
				$scope.scriptChanged = false;
				$scope.currentlyEditing = [{editType:'EQ', allowed:($scope.gafxml.eqEditUser===undefined ? false : $scope.gafxml.eqEditUser._id === $scope.authentication.user._id)},{editType:'CC', allowed:($scope.gafxml.ccEditUser===undefined ? false : $scope.gafxml.ccEditUser._id === $scope.authentication.user._id)},{editType:'FT', allowed:($scope.gafxml.ftEditUser===undefined ? false : $scope.gafxml.ftEditUser._id === $scope.authentication.user._id)}];

				// for (var ed=0; ed < $scope.currentlyEditing.length; ed++){
				// 	Gafglobals.setCurrentlyEditing($scope.currentlyEditing[ed].editType, $scope.currentlyEditing[ed].allowed);
				// }

				var doEditUpdate = false;

				if (Gafglobals.getCurrentlyEditing('EQ') && ($scope.gafxml.eqEditUser===undefined ? true : $scope.gafxml.eqEditUser._id === $scope.authentication.user._id)){
					$scope.gafxml.eqEditUser = $scope.authentication.user;
					doEditUpdate = true;
				} 
				if (Gafglobals.getCurrentlyEditing('CC') && ($scope.gafxml.ccEditUser===undefined ? true : $scope.gafxml.ccEditUser._id === $scope.authentication.user._id)){
					$scope.gafxml.ccEditUser = $scope.authentication.user;
					doEditUpdate = true;
				}
				if (Gafglobals.getCurrentlyEditing('FT') && ($scope.gafxml.ftEditUser===undefined ? true : $scope.gafxml.ftEditUser._id === $scope.authentication.user._id)){
					$scope.gafxml.ftEditUser = $scope.authentication.user;
					doEditUpdate = true;
				}
				if (doEditUpdate){
					$scope.editUpdate();
				}
				// $scope.readWrite = (($scope.authentication.user) && ($scope.authentication.user._id === $scope.gafxml.user._id)) ? 'edit' : 'read';
			});

		};

		$scope.loadGIF = false;

		$scope.generateXML = function() {

			$scope.loadGIF = true;
			$scope.gafxmldata = {};
			var table = [];
			for (var t=0, tlen=$scope.screenData.length; t < tlen; t++){

				var tabl = $scope.screenData[t];

				
				var rows = [];

				for (var row=0, lrow=$scope.screenData[t].data.length; row < lrow; row++){
					rows[row] = {'data':$scope.screenData[t].data[row]};
				}

				table[t] = {'table':{'rows':rows}, '@':{'number':tabl.$.number, 'name':tabl.$.name, 'displayName':tabl.$.displayName, 'description':tabl.$.description}};
				if (tabl.$.hasOwnProperty('img')){
					table[t]['@']['img'] = tabl.$.img;
				}

	    	}
	    	$scope.gafxmldata = {'tables':table};

			// Redirect after save
			
			Gafxmls.json2xml({
				gaf_xml: $scope.gafxmldata,
				'@':{'vendor':$scope.gafxml.vendor,'model':$scope.gafxml.model,'issue':$scope.gafxml.issue,'version':$scope.gafxml.version}
			}, function(response) {
				$scope.convertedXML = response.xml;
				$scope.loadGIF = false;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$window.alert(errorResponse.data.message);
			});
			
			/*
			var x2jdata = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="ngdm_send" id="20" inline="true" x="-196" y="6"><mutation children="5"/><value name="CMD1"><block type="text" id="24"><field name="TEXT">ENT-OC3::</field></block></value><value name="CMD2"><block type="transport_reserved" id="25" inline="false"><field name="reserved_list">devcd</field></block></value><value name="CMD3"><block type="text" id="26"><field name="TEXT">::</field></block></value><value name="CMD4"><block type="ngdm_optional" id="27" inline="true"><mutation children="2"/><value name="OPT1"><block type="transport_parameters" id="28" inline="false"><field name="parm_list">eqp_state</field></block></value></block></value><next><block type="ngdm_resp" id="30" inline="false"><value name="RESP"><block type="text" id="31"><field name="TEXT">COMPLD</field></block></value><next><block type="ngdm_resp" id="32" inline="false"><value name="RESP"><block type="text" id="34"><field name="TEXT">IEAE</field></block></value><next><block type="ngdm_sleep" id="7" inline="true"><value name="SECONDS"><block type="math_number" id="8"><field name="NUM">5</field></block></value><next><block type="ngdm_send" id="9" inline="true"><mutation children="3"/><value name="CMD1"><block type="text" id="13"><field name="TEXT">DLT-OC3::</field></block></value><value name="CMD2"><block type="transport_reserved" id="35" inline="false"><field name="reserved_list">devcd</field></block></value><next><block type="ngdm_resp" id="36" inline="false"><value name="RESP"><block type="text" id="37"><field name="TEXT">COMPLD</field></block></value></block></next></block></next></block></next></block></next></block></next></block></xml>';
				
			Gafxmls.xml2json(x2jdata, function(response) {
				console.log(response);
				$scope.convertedXML = response.xml;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$window.alert(errorResponse.data.message);
			});
			*/
	
		};
	}
]);


angular.module('gafxmls').controller('PublishXMLController', ["$window", "$scope", "$modalInstance", "checkin", function ($window, $scope, $modalInstance, checkin) {

  

	$scope.publishForm={
		authorComments: 'none',
		release: '1.0'
	};

    $scope.publishXML = function(){

		// $scope.remove();
		checkin($scope.publishForm);
		$modalInstance.close();
	};

	$scope.cancelPublish = function(){

		$modalInstance.dismiss('cancel');

	};

}]);

angular.module('gafxmls').controller('DeleteController', ["$window", "$scope", "$modalInstance", "remove", function ($window, $scope, $modalInstance, remove) {

  

  $scope.okToDelete = function(){

		// $scope.remove();
		remove();
		$modalInstance.close();

  };

  $scope.cancelDelete = function(){

		$modalInstance.dismiss('cancel');

  };

  /*
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  */
}]);

angular.module('gafxmls').controller('SaveAckController', ["$window", "$scope", "$modalInstance", "findOne", function ($window, $scope, $modalInstance, findOne) {

  $scope.saveStatus = 'Document Saving...';

  $scope.cancelDelete = function(){

		findOne();
		$modalInstance.dismiss('cancel');

  };
}]);


angular.module('gafxmls').controller('BlocklyController', ["$window", "$scope", "$modalInstance", "saveScript", "getScript", function ($window, $scope, $modalInstance, saveScript, getScript) {

  

  /****************************/
  $scope.messages = [];
  $scope.$on('from-blockly', function(e, message) {
  	$scope.messages.push(message);
	saveScript(message);
  });
  $scope.$on('close-blockly', function(e, message) {
  	$modalInstance.dismiss('cancel');
  });
	  
  $scope.message = function(msg) {
	    $scope.$broadcast('from-parent', msg);
  };
	  
  $scope.saveMessage = function(msg) {
	    $scope.$broadcast('from-parent-save', msg);
  };
	/****************************/

  $scope.loadBlockly = function(){

		return $scope.message(getScript());

  };

  $scope.cancelDelete = function(){

		$modalInstance.dismiss('cancel');

  };

  $scope.saveAndClose = function(){

		// $modalInstance.dismiss('cancel');
		return $scope.saveMessage('Save stuff');

  };

  /*
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  */
}]);

angular.module('gafxmls').controller('VMIToolController', ["$window", "$scope", "$modalInstance", "getXML", function ($window, $scope, $modalInstance, getXML) {

  

  /****************************/
  $scope.vmimessages = [];
  $scope.$on('from-vmitool', function(e, message) {
  	$scope.vmimessages.push(message);
  });
	  
  $scope.message = function(msg) {
	    $scope.$broadcast('from-parent', msg);
  };
	/****************************/

  $scope.loadXML = function(){

		return $scope.message(getXML());

  };

  $scope.cancelDelete = function(){

		$modalInstance.dismiss('cancel');

  };
}]);

angular.module('gafxmls').controller('TreeViewController', ["$window", "$scope", "$modalInstance", "saveHierarchy", "getHierarchy", function ($window, $scope, $modalInstance, saveHierarchy, getHierarchy) {

  
  /****************************/
  $scope.$on('save-treeView', function(e, message) {
  	saveHierarchy(message);
  });
  $scope.$on('close-hierarchy', function(e, message) {
  	$modalInstance.dismiss('cancel');
  });
	  
  $scope.message = function(msg) {
	    $scope.$broadcast('from-parent', msg);
  };
	/****************************/

  $scope.loadXML = function(){

  		var hierarchy = getHierarchy();

  		var msg = {parents: hierarchy.parents, children: hierarchy.children, rootNode:hierarchy.rootNode, nodeColors:hierarchy.nodeColors};

		return $scope.message(msg);

  };
	  
  $scope.saveMessage = function(msg) {
	    $scope.$broadcast('save-png', msg);
  };

  $scope.saveAndClose = function(){

		// $modalInstance.dismiss('cancel');
		return $scope.saveMessage('Save stuff');

  };

  $scope.cancelDelete = function(){

		$modalInstance.dismiss('cancel');

  };
}]);

angular.module('gafxmls').controller('LoaderController', ["$window", "$scope", "$modalInstance", "loaderCreated", function ($window, $scope, $modalInstance, loaderCreated) {

  
  

  $scope.cancelDelete = function(){

		$modalInstance.dismiss('cancel');

  };

  // return loaderCreated();
 
}]);

'use strict';

angular.module('gafxmls').directive('gafxmlRow', function(){

  var rcontroller = function () {

            var vm = this;
          
              
      }; 

  var defTemplate = '<input type="text" data-ng-model="$parent.row[cols.$.name]" id="cols.$.name" class="form-control" placeholder="undefined" required>';
  var inputText = '<input type="text" data-ng-model="$parent.row[cols.$.name]" id="cols.$.name" class="form-control" placeholder="cols.$.name" required>';

  return {

    restrict: 'AE',
    controller: rcontroller,
    scope: {colinfo: '@'},
    require: '^ngController',
    bindToController: true, //required in 1.3+ with controllerAs
    template: function($element, $attrs){
      var col = $attrs.colinfo;
      if (col === 'text'){
        return inputText;
      }else{
        return defTemplate;
      }
    }
  };

});

angular.module('gafxmls').directive('gafCheckboxList', function(){

  var cbController = ["$scope", function ($scope) {

            var vm = this;

            $scope.editMode = 'edit';
            $scope.initMode = true;

            var currTableRow = 0, currTableCol='';

            $scope.setupCheckBoxData = function(cTblRow, cTblCol, selectedVals, allottedVals, keyName, valName){
              currTableRow = cTblRow;
              currTableCol = cTblCol;
              $scope.cbItems = [];
              var skv = {};
              if (angular.isArray(selectedVals))
              {

                if (selectedVals !== undefined ){
                  // selectedVals = getUniqueArray(selectedVals, 'item');
                  for (var s=0, slen=selectedVals.length; s < slen; s++){
                    $scope.cbItems.push(selectedVals[s].item);
                  }
  
                }
              }else{
                skv = {'item': selectedVals};
                $scope.cbItems.push(skv.item);
              }


              $scope.statuses = [];
              for (var v=0, vlen=allottedVals.length; v < vlen; v++){
                // allottedVals = getUniqueArray(allottedVals, 'value');
                var kv = {value:allottedVals[v].$[valName], text:allottedVals[v]._};
                $scope.statuses.push(kv);
              }
              $scope.statuses = getUniqueArray($scope.statuses, 'value');
            };


            $scope.showStatus = function() {
                var selected = [];
                angular.forEach($scope.statuses, function(sel) { 
                  if ($scope.cbItems.indexOf(sel.value) >= 0) {
                    selected.push(sel.text);
                  }
                });
                setCurrTableCellData(selected);
                $scope.initMode = false;
                return selected.length ? selected.join(', ') : 'Not set';
            };

            function setCurrTableCellData(selected){

              $scope.$parent.$parent.row[currTableCol]=[];
              for (var s=0, slen=selected.length; s<slen; s++){
                var kv = {item:selected[s]};
               $scope.$parent.$parent.row[currTableCol].push(kv);
              }

            }


            $scope.$watch(
                'cbItems',
                function( newValue, oldValue ) {
                    // Ignore initial setup.
                    if (!$scope.initMode) stuffChanged(newValue);
                }
            );

            function stuffChanged(data){
              console.log('stuff changed for checkbox');
              $scope.$parent.$parent.docEdited();
            }

            function getUniqueArray(array, item){
              var unique = {};
              var distinct = [];
              for( var i in array ){
               if( typeof(unique[array[i][item]]) === 'undefined'){
                distinct.push(array[i]);
               }
               unique[array[i][item]] = {};
              }
              return distinct;
            }
          
              
      }]; 

  var defTemplate = ' <a href="#" editable-checklist="cbItems" e-ng-options="s.value as s.text for s in statuses">' +
                    '  {{ showStatus() }}' +
                    '</a>';

  var readTemplate = ' <a href="#" buttons="no" editable-checklist="cbItems" e-ng-options="s.value as s.text for s in statuses">' +
                    '  {{ showStatus() }}' +
                    '</a>';

  return {

    restrict: 'AE',
    controller: cbController,
    bindToController: true, //required in 1.3+ with controllerAs
    template: function($element, $attrs){
      if ($attrs.editmode === 'read'){
        return readTemplate;
      }else{
        return defTemplate;
      }
    }
  };

});

angular.module('gafxmls').directive('gafCheckboxOpenList', function(){

  var cbController = ["$scope", function ($scope) {

            var vm = this;

            $scope.editMode = 'edit';
            $scope.initMode = true;

            var currTableRow = 0, currTableCol='';

            $scope.setupCheckBoxData = function(cTblRow, cTblCol, selectedVals, allottedVals, keyName, valName){
              currTableRow = cTblRow;
              currTableCol = cTblCol;
              $scope.cbItems = [];
              // for (var s=0, slen=selectedVals.length; s < slen; s++){
              //   $scope.cbItems.push(selectedVals[s].item);
              // }

              var skv = {};
              if (angular.isArray(selectedVals)){
                // selectedVals = getUniqueArray(selectedVals, 'item');
                for (var s=0, slen=selectedVals.length; s<slen; s++){
                  if (selectedVals[s] !== null){                  
                    skv = selectedVals[s].item;
                    $scope.cbItems.push(skv);
                  }
                }
              }else{
                skv = selectedVals;
                $scope.cbItems.push(skv);
              }


              $scope.statuses = [];
              for (var v=0, vlen=allottedVals.length; v < vlen; v++){
                var kv = {};
                if (angular.isArray(allottedVals[v].text) && allottedVals[v].text.length>0){
                  // allottedVals = getUniqueArray(allottedVals, 'value');
                  for (var i=0,ilen=allottedVals[v].text.length; i<ilen; i++){
                    kv = {value:allottedVals[v].value[i].item, text:allottedVals[v].text[i].item};
                    $scope.statuses.push(kv);
                  }                  
                }else if(allottedVals[v].hasOwnProperty('text')){
                  kv = {value:allottedVals[v].value, text:allottedVals[v].text};
                  $scope.statuses.push(kv);
                }else{
                  kv = {value:allottedVals[v], text:allottedVals[v]};
                  $scope.statuses.push(kv);
                }
              }
              $scope.statuses = getUniqueArray($scope.statuses, 'value');
            };

            $scope.showStatus = function() {
                var selected = [];
                angular.forEach($scope.statuses, function(sel) { 
                  if ($scope.cbItems.indexOf(sel.value) >= 0) {
                    selected.push(sel.text);
                  }
                });
                setCurrTableCellData(selected);
                $scope.initMode=false;
                return selected.length ? selected.join(', ') : 'Not set';
            };

            $scope.$watch(
                'cbItems',
                function( newValue, oldValue ) {
                    // Ignore initial setup.
                    if (!$scope.initMode) stuffChanged(newValue);
                }
            );

            function stuffChanged(data){
              console.log('stuff changed for opencheckbox');
              $scope.$parent.$parent.docEdited();
            }

            function setCurrTableCellData(selected){

              $scope.$parent.$parent.row[currTableCol]=[];
              for (var s=0, slen=selected.length; s<slen; s++){
                var kv = {item:selected[s]};
               $scope.$parent.$parent.row[currTableCol].push(kv);
              }

            }

            function getUniqueArray(array, item){
              var unique = {};
              var distinct = [];
              for( var i in array ){
               if( typeof(unique[array[i][item]]) === 'undefined'){
                distinct.push(array[i]);
               }
               unique[array[i][item]] = {};
              }
              return distinct;
            }
          
              
      }]; 

  var defTemplate = ' <a href="#" editable-checklist="cbItems" e-ng-options="s.value as s.text for s in statuses">' +
                    '  {{ showStatus() }}' +
                    '</a>';

  var readTemplate = ' <a href="#" buttons="no" editable-checklist="cbItems" e-ng-options="s.value as s.text for s in statuses">' +
                    '  {{ showStatus() }}' +
                    '</a>';

  return {

    restrict: 'AE',
    controller: cbController,
    bindToController: true, //required in 1.3+ with controllerAs
    template: function($element, $attrs){
      if ($attrs.editmode === 'read'){
        return readTemplate;
      }else{
        return defTemplate;
      }
    }
  };

});

angular.module('gafxmls').directive('gafTextList', function(){

  var tlController = ["$scope", function ($scope) {

            var vm = this;

            var currTableRow = 0, currTableCol='';

            $scope.editMode = 'edit';
            $scope.initMode = true;

            $scope.tlItems = [{id:1, value:'text'}];

            $scope.setupTextListData = function(cTblRow, cTblCol, selectedVals){
              currTableRow = cTblRow;
              currTableCol = cTblCol;
              $scope.tlItems = [];
              for (var s=0, slen=selectedVals.length; s<slen; s++){
                var kv = {id:s+1, value:selectedVals[s].item};
                $scope.tlItems.push(kv);
              }
              
            };

            function setCurrTableCellData(){

              $scope.$parent.$parent.row[currTableCol]=[];
              
              for (var s=0, slen=$scope.tlItems.length; s<slen; s++){
                var kv = {item:$scope.tlItems[s].value};
               $scope.$parent.$parent.row[currTableCol].push(kv);
              }

            }

            $scope.checkTLData = function(data, id) {
              if ($scope.colInfo.hasOwnProperty('pattern')) {
                var pat = $scope.colInfo.pattern;
                // var pat = '[0-9][0-9](\.[0-9][0-9])*';
                var re = new RegExp(pat,'g');
                if (!re.test(data)){
                  return 'Invalid data format.';
                }
              }
            };

            $scope.$watch(
                'tlItems',
                function( newValue, oldValue ) {
                    // Ignore initial setup.
                    if (!$scope.initMode) stuffChanged(newValue);
                }
            );

            function stuffChanged(data){
              console.log('stuff changed for textlist');
              $scope.$parent.$parent.docEdited();
            }

            // remove user
            $scope.removeRow = function(index) {
              $scope.tlItems.splice(index, 1);
              setCurrTableCellData();
            };

            // add user
            $scope.addRow = function() {
              $scope.inserted = {
                id: $scope.tlItems.length+1,
                item: ''
              };
              $scope.tlItems.push($scope.inserted);
            };

            $scope.saveTLData = function(data, id) {
              for (var s=0, slen=$scope.tlItems.length; s<slen; s++){
                if ($scope.tlItems[s].id === id){
                  $scope.tlItems[s].value = data.tLData;
                }
              }
              stuffChanged(data);
              setCurrTableCellData();
            };
          
              
      }]; 

  var defTemplate = '<table class="table table-bordered table-hover table-condensed">' +
                    '<tr>' +
                    ' <td><button class="btn btn-xs btn-success" ng-click="addRow()">Add row</button></td>' +
                    '</tr>' +
                    ' <tr ng-repeat="item in tlItems">' +
                    '   <td>' +
                    // '<div ng-show="colInfo.hasOwnProperty(\'pattern\')">' +
                      '     <span editable-text="item.value" style="width:10px" e-pattern="{{colInfo.pattern}}" onbeforesave="checkTLData($data, tlItems.id)" e-name="tLData" e-form="rowform" e-required>' +
                      '       {{ item.value || \'empty\' }}' +
                      '     </span>' +
                    // '</div>' + 
                    // '<div ng-hide="colInfo.hasOwnProperty(\'pattern\')">' +
                    //   '     <span editable-text="item.value" style="width:10px" e-name="tLData" e-form="rowform" onbeforesave="checkTLData($data, tlItems.id)" e-required>' +
                    //   '       {{ item.value || \'empty\' }}' +
                    //   '     </span>' +
                      '</div>' +                             
                    '   </td>' +
                    '    <td style="white-space: nowrap">' +
                    '      <!-- form -->' +
                    '      <form editable-form name="rowform" onbeforesave="saveTLData($data, item.id)" ng-show="rowform.$visible" class="form-buttons form-inline" shown="inserted == item">' +
                    '        <button type="submit" ng-disabled="rowform.$waiting" class="btn btn-xs btn-primary">' +
                    '          save' +
                    '        </button>' +
                    '        <button type="button" ng-disabled="rowform.$waiting" ng-click="rowform.$cancel()" class="btn btn-xs btn-default">' +
                    '          cancel' +
                    '        </button>' +
                    '      </form>' +
                    '      <div class="buttons" ng-show="!rowform.$visible">' +
                    '        <p><button class="btn btn-xs btn-primary" ng-click="rowform.$show()">edit</button></p>' +
                    '        <p><button class="btn btn-xs btn-danger" ng-click="removeRow($index)">del</button></p>' +
                    '      </div>  ' +
                    '    </td>' +
                    ' </tr>' +
                    '</table>'; 

  var readTemplate = '<table class="table table-bordered table-hover table-condensed">' +
                    ' <tr ng-repeat="item in tlItems">' +
                    '   <td>' +
                    '     <span editable-text="item.value" style="width:10px" e-name="tLData" e-form="rowform" onbeforesave="checkTLData($data, tlItems.id)" e-required>' +
                    '       {{ item.value || \'empty\' }}' +
                    '     </span>' +
                    '   </td>' +
                    ' </tr>' +
                    '</table>';

  return {

    restrict: 'AE',
    controller: tlController,
    bindToController: true, //required in 1.3+ with controllerAs
    template: function($element, $attrs){
      if ($attrs.editmode === 'read'){
        return readTemplate;
      }else{
        return defTemplate;
      }
    }
  };

});

angular.module('gafxmls').directive('gafDDList', function(){

  var tlController = ["$scope", "$filter", function ($scope, $filter) {

            var vm = this;

            var currTableRow = 0, currTableCol='';

            $scope.editMode = 'edit';

            $scope.tlItems = [{id:1, value:'text'}]; 

            /*$scope.ddList = [
              {value: 1, text: 'status1'},
              {value: 2, text: 'status2'},
              {value: 3, text: 'status3'},
              {value: 4, text: 'status4'}
            ];*/

            $scope.ddList = [];

            $scope.setupTextListData = function(cTblRow, cTblCol, selectedVals, ddData){
              currTableRow = cTblRow;
              currTableCol = cTblCol;
              $scope.tlItems = [];
              var kv = {};
              if (angular.isArray(selectedVals)){
                for (var s=0, slen=selectedVals.length; s<slen; s++){
                  if (selectedVals[s] !== null){                  
                    kv = {id:s+1, value:selectedVals[s].item};
                    $scope.tlItems.push(kv);
                  }
                }
              }else{
                kv = {id:1, value:selectedVals};
                $scope.tlItems.push(kv);
              }

              $scope.ddList = [];

              if (ddData !== undefined){

                for (var dd=0, ddlen=ddData.length; dd<ddlen; dd++){
                  $scope.ddList[dd]=ddData[dd];
                }

              }


            };

            function setCurrTableCellData(){

              $scope.$parent.$parent.row[currTableCol]=[];
              
              for (var s=0, slen=$scope.tlItems.length; s<slen; s++){
                var kv = {item:$scope.tlItems[s].value};
               $scope.$parent.$parent.row[currTableCol].push(kv);
              }

            }

            $scope.checkTLData = function(data, id) {
              // if (id === 2 && data !== 'awesome') {
              //   return "Username 2 should be `awesome`";
              // }
            };

            // remove user
            $scope.removeRow = function(index) {
              $scope.tlItems.splice(index, 1);
              setCurrTableCellData();
            };

            // add user
            $scope.addRow = function() {
              $scope.inserted = {
                id: $scope.tlItems.length+1,
                item: ''
              };
              $scope.tlItems.push($scope.inserted);
            };

            $scope.saveTLData = function(data, id) {
              for (var s=0, slen=$scope.tlItems.length; s<slen; s++){
                if ($scope.tlItems[s].id === id){
                  $scope.tlItems[s].value = data.ddData;
                }
              }
              setCurrTableCellData();
            };

            $scope.showDDdata = function(item) {
              var selected = [];
              if(item.value) {
                selected = $filter('filter')($scope.ddList, {value: item.value});
              }
              return selected.length ? selected[0].text : 'Not set';
            };
          
              
      }]; 

  var defTemplate = '<table class="table table-bordered table-hover table-condensed" style="width:200px">' +
                    '<tr>' +
                    ' <td><button class="btn btn-xs btn-success" ng-click="addRow()">Add row</button></td>' +
                    '</tr>' +
                    ' <tr ng-repeat="item in tlItems">' +
                    '   <td>' +
                    '     <span editable-select="item.value" style="width:140px" e-name="ddData" e-form="rowform" e-ng-options="s.value as s.text for s in ddList" onbeforesave="checkTLData($data, tlItems.id)" e-required>' +
                    '       {{ showDDdata(item) }}' +
                    '     </span>' +
                    '   </td>' +
                    '    <td style="white-space: nowrap">' +
                    '      <!-- form -->' +
                    '      <form editable-form name="rowform" onbeforesave="saveTLData($data, item.id)" ng-show="rowform.$visible" class="form-buttons form-inline" shown="inserted == item">' +
                    '        <p><button type="submit" ng-disabled="rowform.$waiting" class="btn btn-xs btn-primary">' +
                    '          save' +
                    '        </button></p>' +
                    '        <button type="button" ng-disabled="rowform.$waiting" ng-click="rowform.$cancel()" class="btn btn-xs btn-default">' +
                    '          cancel' +
                    '        </button>' +
                    '      </form>' +
                    '      <div class="buttons" ng-show="!rowform.$visible">' +
                    '        <p><button class="btn btn-xs btn-primary" ng-click="rowform.$show()">edit</button></p>' +
                    '        <p><button class="btn btn-xs btn-danger" ng-click="removeRow($index)">del</button></p>' +
                    '      </div>  ' +
                    '    </td>' +
                    ' </tr>' +
                    '</table>'; 

  var readTemplate = '<table class="table table-bordered table-hover table-condensed">' +
                    ' <tr ng-repeat="item in tlItems">' +
                    '   <td>' +
                    '     <span editable-text="item.value" style="width:10px" e-name="ddData" e-form="rowform" onbeforesave="checkTLData($data, tlItems.id)" e-required>' +
                    '       {{ item.value || \'empty\' }}' +
                    '     </span>' +
                    '   </td>' +
                    ' </tr>' +
                    '</table>';

  return {

    restrict: 'AE',
    controller: tlController,
    bindToController: true, //required in 1.3+ with controllerAs
    template: function($element, $attrs){
      if ($attrs.editmode === 'read'){
        return readTemplate;
      }else{
        return defTemplate;
      }
    }
  };

});

angular.module('gafxmls').directive('gafSegmentTable', function(){

  var segmentController = ["$scope", "$filter", "$window", function ($scope, $filter, $window) {

            var vm = this;

            var currTableRow = 0, currTableCol='';

            $scope.editMode = 'edit';
            $scope.initMode = true;

            $scope.dataError = false;

            $scope.segmentData = [{id:1, value:'text', dataType:'AN', segmentSize:'10'}];

            $scope.dataTypes = [
              {value:'int', text:'Numeric', sample:'1,2,99'},
              {value:'string', text:'AlphaNumeric', sample:'PST,SST'},
              {value:'range', text:'Range', sample:'1-10,100-120'},
              {value:'regex', text:'Expression', sample:'([A-Z][A-Z0-9]*)'},
              {value:'qs', text:'Quoted String', sample:'\'Abcd...xyz\''},
              {value:'tbl', text:'Table', sample:'\'1-80\''}
            ];

            $scope.setupSegmentTabletData = function(cTblRow, cTblCol, selectedVals){
              currTableRow = cTblRow;
              currTableCol = cTblCol;
              $scope.segmentData = [];
              var kv = {};
              if (angular.isArray(selectedVals)){
                for (var s=0, slen=selectedVals.length; s<slen; s++){
                  if (selectedVals[s] !== null){ 
                    var sval = selectedVals[s].item;
                    if (sval.dataType==='tbl'){
                      kv = {id:sval.id, dataType:sval.dataType, segmentSize:sval.segmentSize, value:sval.value, separator:sval.separator};
                    }else if (sval.dataType==='range'){
                      kv = {id:sval.id, beginRange:sval.beginRange, endRange:sval.endRange, rangeStep:sval.rangeStep===undefined ? '1':sval.rangeStep, dataType:sval.dataType, segmentSize:sval.segmentSize};
                    }else if (sval.dataType==='qs' || sval.dataType==='int'){
                      kv = {id:sval.id, dataType:sval.dataType, segmentSize:sval.segmentSize, value:sval.value};
                    }else if (sval.dataType==='regex'){
                      kv = {id:sval.id, dataType:sval.dataType, segmentSize:sval.segmentSize, value:sval.value};
                    }else if (sval.dataType==='string'){
                      kv = {id:sval.id, dataType:sval.dataType, segmentSize:sval.segmentSize, value:(sval.value===undefined) ? '':sval.value};
                    }else if (sval.hasOwnProperty('value') && sval.value !== '' && sval.value !== undefined){
                      kv = {id:sval.id, value:sval.value, dataType:sval.dataType, segmentSize:sval.segmentSize};
                    }else{
                      kv = {id:s+1, value:sval, dataType:'string'};
                    }
                    
                    $scope.segmentData.push(kv);
                  }
                }
              }else{
                kv = {id:1, value:selectedVals, dataType:'AN', segmentSize:'10'};
                $scope.segmentData.push(kv);
              }

            };

            $scope.showDataTypes = function(segment) {
              var selected = [];
              if(segment.dataType) {
                selected = $filter('filter')($scope.dataTypes, {value: segment.dataType});
              }
              return selected.length ? selected[0].text : 'Not set';
            };

            $scope.checkName = function(data, id) {
              if (id === 2 && data !== 'awesome') {
                return 'Username 2 should be awesome';
              }
            };

            $scope.$watch(
                'segmentData',
                function( newValue, oldValue ) {
                    // Ignore initial setup.
                    if (!$scope.initMode) stuffChanged(newValue);
                }
            );

            function stuffChanged(data){
              console.log('stuff changed for segment');
              $scope.$parent.$parent.docEdited();
            }


            $scope.segmentError = '';

            $scope.checkValue = function(value, dataType, segmentSize, beginRange, endRange, rangeStep, separator) {
              switch (dataType){

                case 'int':
                  if ((beginRange !== '' && beginRange !== undefined) || (endRange !== '' && endRange !== undefined)){
                    $scope.segmentError = 'Range values are not applicable for Numeric Data Type';
                    return 'Range values are not applicable for Numeric Data Type';
                    // return false;
                  }
                  if (isNaN(value) || value === undefined){
                    $scope.segmentError = 'Value should be number for Numeric Data Type';
                    return 'Value should be number for Numeric Data Type';
                    // return false;

                  }
                  if (separator !== '' && separator !== undefined){
                    $scope.segmentError = 'Separator invalid for Numeric Data Type';
                    return 'Separator invalid for Numeric Data Type';
                    // return false;

                  }

                  if (rangeStep !== '' && rangeStep !== undefined){
                    $scope.segmentError = 'Range Step is invalid for Numeric Data Type';
                    return 'Range Step is invalid for Numeric Range Type';
                    // return false;

                  }
                  break;
                case 'string':
                  if ((beginRange !== '' && beginRange !== undefined) || (endRange !== '' && endRange !== undefined)){
                    $scope.segmentError = 'Range values are not applicable for AlphaNumeric Data Type';
                    return 'Range values are not applicable for AlphaNumeric Data Type';
                    // return false;
                  }
                  /*if (value === '' || value === undefined){
                    $scope.segmentError = 'Value cannot be empty';
                    return 'Value cannot be empty';
                    // return false;

                  }*/
                  if (separator !== '' && separator !== undefined){
                    $scope.segmentError = 'Separator invalid for String Data Type';
                    return 'Separator invalid for String Data Type';
                    // return false;

                  }
                  if (rangeStep !== '' && rangeStep !== undefined){
                    $scope.segmentError = 'Range Step is invalid for String Data Type';
                    return 'Range Step is invalid for String Range Type';
                    // return false;

                  }
                  break;
                case 'qs':
                  if ((beginRange !== '' && beginRange !== undefined) || (endRange !== '' && endRange !== undefined)){
                    $scope.segmentError = 'Range values are not applicable for Quoted String Data Type';
                    return 'Range values are not applicable for Quoted String Data Type';
                    // return false;
                  }
                  if (isNaN(segmentSize) || segmentSize===undefined  || segmentSize===''){
                    $scope.segmentError = 'Size should be valid number for Quoted String Data Type';
                    return 'Value should be number for Quoted String Data Type';
                    // return false;

                  }
                  if (separator !== '' && separator !== undefined){
                    $scope.segmentError = 'Separator invalid for Quoted String Data Type';
                    return 'Separator invalid for Quoted String Data Type';
                    // return false;

                  }
                  if (rangeStep !== '' && rangeStep !== undefined){
                    $scope.segmentError = 'Range Step is invalid for Quoted String Data Type';
                    return 'Range Step is invalid for Quoted String Range Type';
                    // return false;

                  }
                  break;
                case 'range':
                  if ((beginRange === '' || beginRange === undefined) || (endRange === '' || endRange === undefined)){
                    $scope.segmentError = 'Provide Begin and End Values for Range';
                    return 'Provide Begin and End Values for Range';
                    // return false;
                  }
                  if (value !== '' && value !== undefined){
                    $scope.segmentError = 'Value is not applicable for Range Data Type';
                    return 'Value is not applicable for Range Range Type';
                    // return false;

                  }
                  if (rangeStep === '' || rangeStep === undefined){
                    $scope.segmentError = 'Range Step is required for Range Data Type';
                    return 'Range Step is required for Range Range Type';
                    // return false;

                  }
                  if (isNaN(segmentSize)){
                    $scope.segmentError = 'Size should be empty for Range Data Type';
                    return 'Value should be number for Numeric Range Type';
                    // return false;

                  }
                  break;
                case 'regex':
                  if ((beginRange !== '' && beginRange !== undefined) || (endRange !== '' && endRange !== undefined)){
                    $scope.segmentError = 'Range values are not applicable for Expression Data Type';
                    return 'Range values are not applicable for Expression Data Type';
                    // return false;
                  }
                  /*if (value === '' || value === undefined){
                    $scope.segmentError = 'Value cannot be empty';
                    return 'Value cannot be empty';
                    // return false;

                  }*/
                  if (isNaN(segmentSize) || segmentSize===undefined || segmentSize===''){
                    $scope.segmentError = 'Size should be valid number for Expression Data Type';
                    return 'Value should be number for Expression Data Type';
                    // return false;

                  }

                  if (separator !== '' && separator !== undefined){
                    $scope.segmentError = 'Separator invalid for Expression Data Type';
                    return 'Separator invalid for Expression Data Type';
                    // return false;

                  }
                  break;
                case 'tbl':
                  
                  if ((beginRange !== '' && beginRange !== undefined) || (endRange !== '' && endRange !== undefined)){
                    $scope.segmentError = 'Range values are not applicable for Table Data Type';
                    return 'Range values are not applicable for Table Data Type';
                    // return false;
                  }

                  if (value === '' || value === undefined){
                    $scope.segmentError = 'Value cannot be empty';
                    return 'Value cannot be empty';
                    // return false;

                  }
                  
                  if (separator === '' || separator === undefined){
                    $scope.segmentError = 'Separator cannot be empty';
                    return 'Separator cannot be empty';
                    // return false;

                  }
                  if (segmentSize!==undefined && segmentSize!==''){
                    $scope.segmentError = 'Size is invalid for Table Data Type';
                    return 'Size is invalid for Table Data Type';
                    // return false;

                  }
                  break;

              }
              $scope.segmentError = '';
            };

            $scope.checkBeginRange = function(data, id, dataType, segmentSize) {
              return 'not valid';
            };

            $scope.checkEndRange = function(data, id, dataType, segmentSize) {
              // return validateSegementData(data);
            };

            // add segment
            $scope.addSegment = function() {
              $scope.inserted = {
                id: $scope.segmentData.length+1,
                value: '',
                beginRange: '',
                endRange: '',
                dataType: null,
                segmentSize: ''
              };
              $scope.segmentData.push($scope.inserted);
            };

            $scope.validateSegementData = function(data, id) {

              return $scope.checkValue(data.value, data.dataType, data.segmentSize, data.beginRange, data.endRange, data.rangeStep, data.separator);

            };

            $scope.saveSegment = function(data, id) {

              
              
              //$scope.user not updated yet
              var sdata = {
                id: id,
                value: data.value,
                beginRange: data.beginRange,
                endRange: data.endRange,
                rangeStep: data.rangeStep,
                separator: data.separator,
                dataType: data.dataType,
                segmentSize: data.segmentSize
              };
              angular.extend(data, {id: id});
              for (var s=0; s<$scope.segmentData.length; s++){
                if ($scope.segmentData[s].id === id){
                  $scope.segmentData[s] = sdata;
                  break;
                }
              }

              stuffChanged(data);
              setCurrTableCellData();
              // return $http.post('/saveUser', data);
            };

            function setCurrTableCellData(){

              $scope.$parent.$parent.row[currTableCol]=[];
              
              for (var s=0, slen=$scope.segmentData.length; s<slen; s++){
                var kv = {item:$scope.segmentData[s]};
               $scope.$parent.$parent.row[currTableCol].push(kv);
              }

            }

            // remove segment
            $scope.removeSegment = function(index) {
              $scope.segmentData.splice(index, 1);
              setCurrTableCellData();
            };

            $scope.setCurrentDataType = function(data){
              $scope.currentDataType = data;
              console.log('current datatype=' + data);
            };
  }]; 

  var defTemplate = '<div ng-show="segmentError.length > 0" class="alert alert-danger alert-xs"><span><strong>{{segmentError}}</strong></span><br/></div>' +
                    '<button class="btn btn-default btn-xs btn-success" ng-click="addSegment()">Add row</button>' +
                    '<table align="center" class="table table-bordered table-hover table-condensed" style="width:420px">' +
                   '<tr>' +
                      '<th class="col-sm-3">Data Types</th>' +
                      '<th class="col-sm-1">Size</th>' +
                      '<th class="col-sm-1">Value</th>' +
                      '<th class="col-sm-2">Range Values</th>' +
                      '<th class="col-sm-1">Edit</th>' +
                    '</tr>' +
                    '<tr ng-repeat="segment in segmentData">' +
                      '<td>' +
                        '<!-- editable status (select-local) -->' +
                        '<span editable-select="segment.dataType" e-style="width:140px" e-onChange="console.log(\'changed\');" e-name="dataType" e-form="rowform" e-ng-options="s.value as s.text for s in dataTypes">' +
                          '{{ showDataTypes(segment) }}' +
                        '</span>' +
                      '</td>' +
                      '<td>' +
                        '<!-- editable group (select-remote) -->' +
                        '<span editable-text="segment.segmentSize" e-style="width:50px" e-name="segmentSize" e-form="rowform">' +
                          '{{ segment.segmentSize || \'empty\' }}' +
                        '</span>' +
                      '</td>' +
                      '<td>' +
                        '<!-- editable username (text with validation) -->' +
                        'Data:&nbsp;<span editable-text="segment.value" e-style="width:140px" e-name="value" e-form="rowform" e-required>' +
                          '{{ segment.value || \'empty\' }}' +
                        '</span><br/>' +
                        '<!-- editable username (text with validation) -->' +
                        'Table Separator:&nbsp;<span editable-text="segment.separator" e-style="width:140px" e-name="separator" e-form="rowform" e-required>' +
                          '{{ segment.separator || \'empty\' }}' +
                        '</span>' +
                      '</td>' +
                      '<td>' +
                        '<!-- editable username (text with validation) -->' +
                        'Begin:&nbsp;<span editable-text="segment.beginRange" e-style="width:140px" e-name="beginRange" e-form="rowform" e-required>' +
                          '{{ segment.beginRange || \'empty\' }}' +
                        '</span><br/>' +
                        '<!-- editable username (text with validation) -->' +
                        'End:&nbsp;<span editable-text="segment.endRange" e-style="width:140px" e-name="endRange" e-form="rowform" e-required>' +
                          '{{ segment.endRange || \'empty\' }}' +
                        '</span><br/>' +
                        '<!-- editable username (text with validation) -->' +
                        'Step:&nbsp;<span editable-text="segment.rangeStep" e-style="width:140px" e-name="rangeStep" e-form="rowform" e-required>' +
                          '<strong>{{ segment.rangeStep || \'empty\' }}</strong>' +
                        '</span>' +
                      '</td>' +
                      '<td style="white-space: nowrap">' +
                        '<!-- form -->' +
                        '<form editable-form name="rowform" onbeforesave="validateSegementData($data, segment.id)" onaftersave="saveSegment($data, segment.id)" ng-show="rowform.$visible" class="form-buttons form-inline" shown="inserted == segment">' +
                          '<button type="submit" ng-disabled="rowform.$waiting" class="btn btn-primary btn-xs">' +
                            'Save' +
                          '</button><br/>' +
                          '<button type="button" ng-disabled="rowform.$waiting" ng-click="rowform.$cancel()" class="btn btn-default btn-xs">' +
                            'Cancel' +
                          '</button>' +
                        '</form>' +
                        '<div class="buttons" ng-show="!rowform.$visible">' +
                          '<button class="btn btn-primary btn-xs" ng-click="rowform.$show()">Edit</button><br/>' +
                          '<button class="btn btn-danger btn-xs" ng-click="removeSegment($index)">Del</button>' +
                        '</div>'   +
                      '</td>' +
                    '</tr>' +
                  '</table>';

  var readTemplate = '<table align="center" class="table table-bordered table-hover table-condensed" style="width:400px">' +
                    '<tr style="font-weight: bold">' +
                      '<td style="width:30%">Data Type</td>' +
                      '<td style="width:15%">Size</td>' +
                      '<td style="width:35%">Value</td>' +
                      '<td style="width:35%">Range Values</td>' +
                    '</tr>' +
                    '<tr ng-repeat="segment in segmentData">' +
                      '<td>' +
                        '<!-- editable status (select-local) -->' +
                        '<span editable-select="segment.dataType" e-style="width:240px" e-onChange="console.log(\'changed\');" e-name="dataType" e-form="rowform" e-ng-options="s.value as s.text for s in dataTypes">' +
                          '{{ showDataTypes(segment) }}' +
                        '</span>' +
                      '</td>' +
                      '<td>' +
                        '<!-- editable group (select-remote) -->' +
                        '<span editable-text="segment.segmentSize" e-style="width:50px" e-name="segmentSize" e-form="rowform">' +
                          '{{ segment.segmentSize || \'empty\' }}' +
                        '</span>' +
                      '</td>' +
                      '<td>' +
                        '<!-- editable username (text with validation) -->' +
                        '<span editable-text="segment.value" e-style="width:140px" e-name="value" e-form="rowform" e-required>' +
                          '{{ segment.value || \'empty\' }}' +
                        '</span>&nbsp;|&nbsp;' +
                        '<!-- editable username (text with validation) -->' +
                        'Table Separator:<span editable-text="segment.separator" e-style="width:140px" e-name="separator" e-form="rowform" e-required>' +
                          '{{ segment.separator || \'empty\' }}' +
                        '</span>' +
                      '</td>' +
                      '<td>' +
                        '<!-- editable username (text with validation) -->' +
                        'Begin:<span editable-text="segment.beginRange" e-style="width:140px" e-name="beginRange" e-form="rowform" e-required>' +
                          '{{ segment.beginRange || \'empty\' }}' +
                        '</span>&nbsp;|&nbsp;' +
                        '<!-- editable username (text with validation) -->' +
                        'End:<span editable-text="segment.endRange" e-style="width:140px" e-name="endRange" e-form="rowform" e-required>' +
                          '{{ segment.endRange || \'empty\' }}' +
                        '</span>&nbsp;|&nbsp;' +
                        '<!-- editable username (text with validation) -->' +
                        'Step:<span editable-text="segment.rangeStep" e-style="width:140px" e-name="rangeStep" e-form="rowform" e-required>' +
                          '{{ segment.rangeStep || \'empty\' }}' +
                        '</span>' +
                      '</td>' +
                  '</table>';

  return {

    restrict: 'AE',
    controller: segmentController,
    bindToController: true, //required in 1.3+ with controllerAs
    template: function($element, $attrs){
      if ($attrs.editmode === 'read'){
        return readTemplate;
      }else{
        return defTemplate;
      }
    }
  };

});

angular.module('gafxmls').directive('gafxmlTable', function(){

  var controller = ["$scope", "$window", function ($scope, $window) {
          
              var vm = this;

              $scope.colWidths = [];
              $scope.maxRowIndex = 0;

              $scope.getColumnWidth = function(colname){

                for (var cn=0, cnlen= $scope.colWidths.length; cn < cnlen; cn++){
                  var cw = $scope.colWidths[cn];
                  if (cw.colname === colname){
                    return cw.colwidth;
                  }
                }

              };

              $scope.setColumnWidth = function(colname, colwidth){

                for (var cn=0, cnlen= $scope.colWidths.length; cn < cnlen; cn++){
                  var cw = $scope.colWidths[cn];
                  if (cw.colname === colname){
                    cw.colwidth = colwidth;
                    $scope.colWidths[cn]=cw;
                    break;
                  }
                }

              };

              // init
              /*$scope.sort = {       
                  sortingOrder : $scope.currentTable.column[1].$.name,
                  reverse : false
              };*/

             $scope.addRow = function() {
                console.log('addRow');
                var tmparr = [];
                var dataItems={};
                
                if ($scope.searchText !== undefined && $scope.searchText !== ''){
                  $window.alert('There is a search item "' + $scope.searchText + '". Please remove that to add an empty row.');
                  return;
                }
                

                for (var j=0, jlen=$scope.currentTable.column.length; j < jlen; j++){
                  var col = $scope.currentTable.column[j];
                  dataItems[col.$.name] = '';
                }
                dataItems.rowIndex = $scope.getNewRowIndex();
                // dataItems.rowIndex = $scope.getNewRowIndex();
                tmparr.push(dataItems);
                for (var di=0,dilen=$scope.currentTable.data.length;di<dilen;di++){
                  dataItems = $scope.currentTable.data[di];
                  tmparr.push(dataItems);
                }

                $scope.currentTable.data = tmparr;


                
              };

              $scope.addAfterRow = function(ind) {
                console.log('addRow:' + ind);

                if ($scope.searchText !== undefined && $scope.searchText !== ''){
                  $window.alert('There is a search item "' + $scope.searchText + '". Please remove that to add an empty row.');
                  return;
                }
                var tmparr = [];                
                var rowind = getRow(ind);

                for (var di=0,dilen=$scope.currentTable.data.length;di<dilen;di++){
                  var dataItems={};
                  if (di === rowind){

                    var tmpdataItems={};
                    tmpdataItems = $scope.currentTable.data[di];
                    tmparr.push(tmpdataItems);

                    for (var j=0, jlen=$scope.currentTable.column.length; j < jlen; j++){
                      var col = $scope.currentTable.column[j];
                      dataItems[col.$.name] = '';
                    }
                    dataItems.rowIndex = $scope.getNewRowIndex();

                  }else{

                    dataItems = $scope.currentTable.data[di];

                  }
                  

                  tmparr.push(dataItems);
                }

                $scope.currentTable.data = tmparr;


                
              };

              $scope.duplicateRow = function(ind) {
                console.log('addRow:' + ind);
                var tmparr = [];                
                var rowind = getRow(ind);

                for (var di=0,dilen=$scope.currentTable.data.length;di<dilen;di++){
                  var dataItems={};
                  if (di === rowind){

                    var tmpdataItems={};
                    tmpdataItems = angular.copy($scope.currentTable.data[di]);
                    tmparr.push(tmpdataItems);

                    for (var j=0, jlen=$scope.currentTable.column.length; j < jlen; j++){
                      var col = $scope.currentTable.column[j];
                      dataItems[col.$.name] = angular.copy($scope.currentTable.data[getRow(ind)][col.$.name]);
                    }
                    dataItems.rowIndex = $scope.getNewRowIndex();

                  }else{

                    dataItems = $scope.currentTable.data[di];

                  }

                  
                    

                  tmparr.push(dataItems);
                }

                $scope.currentTable.data = tmparr;


                
              };

              
              $scope.deleteRow = function(ind) {

                var r = $window.confirm('Are you sure you want to delete this row?');
                if (r === true) {
                    $scope.currentTable.data.splice(getRow(ind), 1);
                }
                
                
                   
              };


              function getRow(rIndex){
                /*for(var ri=0,rilen=$scope.currentTable.data.length;ri < rilen; ri++){
                  if ($scope.currentTable.data[ri].rowIndex === rIndex){
                    return ri;
                  }
                }*/
                return $scope.getRowIndex(rIndex);
              }

              $scope.getRowIndex = function(rIndex){
                for(var ri=0,rilen=$scope.currentTable.data.length;ri < rilen; ri++){
                  if ($scope.currentTable.data[ri].rowIndex === rIndex){
                    return ri;
                  }
                }
              };

              $scope.getNewRowIndex = function(){
                // if ($scope.currentTable.data.length === undefined || $scope.currentTable.data.length <= 0){
                //   $scope.maxRowIndex = 1;
                // }else{
                  $scope.maxRowIndex = 0;
                // }
                for (var ci=0, cilen=$scope.currentTable.data.length; ci<cilen; ci++){

                  if ($scope.currentTable.data[ci].rowIndex > $scope.maxRowIndex){
                    $scope.maxRowIndex = $scope.currentTable.data[ci].rowIndex;
                  }

                }
                $scope.maxRowIndex = $scope.maxRowIndex + 1;
                return $scope.maxRowIndex;

              };


              $scope.setRowStatus = function(ind, status) {
                $scope.currentTable.data[getRow(ind)].rowStatus=status;
                console.log('row ' + ind +  ' status ' + status);
              };

              $scope.isRowStatusChanged = function(row){
                if (row.hasOwnProperty('rowStatus')){
                  switch(row.rowStatus){
                    case 'removed':

                      return 'danger rowRemoved';

                    case 'changed':
                        return 'success rowChanged';

                    case 'new':
                        return 'info rowAdded';

                    case 'tsrblock':
                        return 'warning';

                    case 'saveWarning':
                        return 'warning';

                    default:
                        return 'active';

                  }
                }
              };

              function getEditMode(){
                return 'text';
              }

              /////Used to mark Blockly Script row////////
              $scope.idSelectedVote = null;
              $scope.setSelected = function(idSelectedVote) {
                 $scope.idSelectedVote = idSelectedVote;
                 // console.log('selected row:' + idSelectedVote);
              };
              //////////// 
              $scope.dynamicSize = {
                  'width' : 350,
                  'height' : 250
              };
            
              $scope.flexbox = true;
              $scope.size = {};  
              $scope.events = [];
              $scope.$on('angular-resizable.resizeEnd', function (event, args) {
                $scope.msg = 'Resize me again...';
                $scope.events.unshift(event);
                $scope.size = args;
                if(args.width)
                  $scope.dynamicSize.width = args.width;
                if(args.height)
                  $scope.dynamicSize.height = args.height;
                $scope.setColumnWidth(args.id, args.width);
              });
              $scope.$on('angular-resizable.resizeStart', function (event, args) {
                $scope.msg = 'Woooohoooo!..' + args.width;
                $scope.events.unshift(event);
              });  

              $scope.docEdited = function(){
                $scope.$parent.scriptChanged = true;
              };
              
      }]; 

  var template = '<tr><td ng-repeat="item in datasource"><input type="text" /></td></tr>';
  var buttons = '<div><input type="button" class="btn btn-sm btn-primary" ng-click="showModel(currentTable)" title="Show Model"/></div>';
  var search = '<div class="well well-sm">' +
                '  <span class="label label-primary">Search</span>' +
                '  <input type="text" size="35" ng-model="searchText">' +
                '</div>';
  var etemplate = '<div class="outer" style="width:{{currentTable.$.tableWidth}}"><div class="innera" style="width:{{currentTable.$.tableWidth}}">' +
                    '<table class="table table-bordered table-striped table-hover table-condensed">' +
                      '<thead><th class="btn btr-primary" style="width:80px; text-align:center"' +
                          '<div class="pull-center">' +
                              '<a class="btn btn-primary btn-sm" data-ng-click="addRow();">' +
                                  '<i class="glyphicon glyphicon-plus"></i>' +
                              '</a>' +
                          '</div>' +
                      '</th>' +
                      // '<th ng-repeat="cols in currentTable.column" ng-hide="cols.$.name==\'rowStatus\'" class="repeat-animation" style="width:{{cols.$.colSize}};min-width:{{cols.$.colSize}};max-width:{{cols.$.colSize}};">' +
                      '<th class="btn btr-primary" style="text-align:center" ng-repeat="cols in currentTable.column" id="{{cols.$.name}}" ng-init="colWidths.push({\'colname\':cols.$.name, \'colwidth\':cols.$.colSize.replace(\'px\',\'\')})" ng-hide="cols.$.name==\'rowStatus\'" class="repeat-animation" resizable r-directions="[\'right\']" r-flex="false" r-width="getColumnWidth(cols.$.name)">' +
                          // '{{getColumnHeaders(cols.$.name)}}&nbsp;<a href="#" custom-sort order="cols.$.name" sort="sort"></a>' +
                          '{{getColumnHeaders(cols.$.name)}}&nbsp;<a href="#"></a>' +
                      '</th>' +
                      '<th class="btn btr-primary" style="width:80px; text-align:center">' +
                          '<div class="pull-center">' +
                              '<a class="btn btn-primary btn-sm" data-ng-click="addRow();">' +
                                  '<i class="glyphicon glyphicon-plus"></i>' +
                              '</a>' +
                          '</div>' +
                      '</th></thead>' +
                      '<tbody>' +
                          '<tr ng-repeat="row in currentTable.data | filter:searchText" track by $index ng-init="currentRow=row.rowIndex" ng-click="setSelected(currentRow)" ng-class="isRowStatusChanged(row)">' +
                              '<td style="width:100px">' +
                                  '<ul class="nav navbar-nav"><li class="dropdown">' +
                                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
                                      '<span>Action</span> <b class="caret"></b>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu">' +
                                      '<li>' +
                                        '<a class="btn btn-primary btn-sm" data-ng-click="addAfterRow(currentRow);" data-toggle="popover" title="Add a row">' +
                                                                  '<i class="glyphicon glyphicon-plus"></i>' +
                                                    '</a></b>' +
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-primary btn-sm" data-ng-click="deleteRow(currentRow);" data-toggle="popover" title="Delete this row">' +
                                                                  '<i class="glyphicon glyphicon-trash"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-primary btn-sm" data-ng-click="duplicateRow(currentRow);" data-toggle="popover" title="Duplicate this row">' +
                                                                  '<i class="glyphicon glyphicon-duplicate"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-success btn-sm" data-ng-click="setRowStatus(currentRow,\'changed\');" data-toggle="popover" title="Mark this row as changed">' +
                                                                  '<i class="glyphicon glyphicon-paperclip"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                         '<a class="btn btn-danger btn-sm" data-ng-click="setRowStatus(currentRow,\'removed\');" data-toggle="popover" title="Mark this row as removed">' +
                                                                  '<i class="glyphicon glyphicon-scissors"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-info btn-sm" data-ng-click="setRowStatus(currentRow,\'new\');" data-toggle="popover" title="Mark this row as new">' +
                                                                  '<i class="glyphicon glyphicon-star"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-default btn-sm" data-ng-click="setRowStatus(currentRow,\'\');" data-toggle="popover" title="Reset to normal row">' +
                                                                  '<i class="glyphicon glyphicon-step-backward"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-warning btn-sm" data-ng-click="setRowStatus(currentRow,\'tsrblock\');" data-toggle="popover" title="Block TSR Display">' +
                                                                  '<i class="glyphicon glyphicon-ban-circle"></i>' +
                                                              '</a></b>' +
                                      '</li>' +
                                    '</ul>' +
                                  '</li></ul>' +
                              '</td>' +
                              '<td ng-repeat="cols in currentTable.column" track by $index ng-hide="cols.$.name==\'rowStatus\'" id="{{cols.$.name}}" class="repeat-animation" ng-init="colInfo=getColInfo(cols.$.name);currentColumn=$index" style="width:{{getColumnWidth(cols.$.name)}}px;min-width:{{getColumnWidth(cols.$.name)}}px;max-width:{{getColumnWidth(cols.$.name)}}px;" resizable r-directions="[\'right\']" r-flex="false" r-width="getColumnWidth(cols.$.name)">' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'text\'">' +
                                    '<div ng-show="colInfo.hasOwnProperty(\'pattern\')">' +
                                      '<a href="#" editable-text="$parent.row[cols.$.name]" onbeforesave="docEdited()" e-pattern="{{colInfo.pattern}}" e-required e-placeholder="cols.$.name">{{ $parent.row[cols.$.name] || \'empty\' }}</a>' +
                                    '</div>' +
                                    '<div ng-hide="colInfo.hasOwnProperty(\'pattern\')">' +
                                      '<a href="#" editable-text="$parent.row[cols.$.name]" onbeforesave="docEdited()" e-required e-placeholder="cols.$.name">{{ $parent.row[cols.$.name] || \'empty\' }}</a>' +
                                    '</div>' +                                   
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'checkbox\'">' +
                                     '<gaf-checkbox-list ng-init="setupCheckBoxData($parent.row, cols.$.name,$parent.row[cols.$.name], colInfo.domain, \'_\', colInfo.domainValue)" />' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'textlist\'">' +
                                     '<gaf-text-list ng-init="setupTextListData($parent.row, cols.$.name,$parent.row[cols.$.name])" />' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'segment\'">' +
                                     '<gaf-Segment-Table ng-init="setupSegmentTabletData($parent.row, cols.$.name,$parent.row[cols.$.name])" />' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'checkboxopen\'">' +
                                    '<div ng-init="ddData = getLookupData(currentRow,cols.$.name)">' +
                                     '<gaf-checkbox-open-list ng-init="setupCheckBoxData($parent.row, cols.$.name,$parent.row[cols.$.name], ddData, \'_\', colInfo.domainValue)" />' +
                                    '</div>' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'textarea\'">' +
                                    '<a href="#" e-rows="7" e-cols="35" onbeforesave="docEdited()" editable-textarea="$parent.row[cols.$.name]" e-required e-placeholder="cols.$.name">{{ $parent.row[cols.$.name] || \'empty\' }}</a>' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'script\'" ng-class="{selected : currentRow === idSelectedVote}">' +
                                  '  <a href="#" e-rows="7" e-cols="35"  editable-textarea="$parent.row[cols.$.name].xml" e-required e-placeholder="cols.$.name">{{ $parent.row[cols.$.name].xml | limitTo:5 || \'empty\' }}</a>' +
                                  '  <a class="pull-right btn btn-primary" data-ng-click="blocklyRow=getRowIndex(currentRow);setBlocklyRowCol(blocklyRow,cols.$.name, $parent.row[cols.$.name]);openBlocklyEditor(\'lg\');">' +
                                  '   <i class="glyphicon glyphicon-pencil" toggle-data="toggle" title="Blockly Document"></i>' +
                                  '  </a>' +
                                  '</div>' +
                                  '<span ng-if="getColumnDisplayType(cols.$.name)===\'span\'" data-ng-model="$parent.row[cols.$.name]">{{$parent.row[cols.$.name]}}</span>' +
                              '</td>' +
                              '<td>' +
                                  '<ul class="nav navbar-nav"><li class="dropdown">' +
                                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
                                      '<span>Action</span> <b class="caret"></b>' +
                                    '</a><small>{{currentRow+1}}</small>' +
                                    '<ul class="dropdown-menu">' +
                                      '<li>' +
                                        '<a class="btn btn-primary btn-sm" data-ng-click="addAfterRow(currentRow);" data-toggle="popover" title="Add a row">' +
                                                                  '<i class="glyphicon glyphicon-plus"></i>' +
                                                    '</a></b>' +
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-primary btn-sm" data-ng-click="deleteRow(currentRow);" data-toggle="popover" title="Delete this row">' +
                                                                  '<i class="glyphicon glyphicon-trash"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-primary btn-sm" data-ng-click="duplicateRow(currentRow);" data-toggle="popover" title="Duplicate this row">' +
                                                                  '<i class="glyphicon glyphicon-duplicate"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-success btn-sm" data-ng-click="setRowStatus(currentRow,\'changed\');" data-toggle="popover" title="Mark this row as changed">' +
                                                                  '<i class="glyphicon glyphicon-paperclip"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                         '<a class="btn btn-danger btn-sm" data-ng-click="setRowStatus(currentRow,\'removed\');" data-toggle="popover" title="Mark this row as removed">' +
                                                                  '<i class="glyphicon glyphicon-scissors"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-info btn-sm" data-ng-click="setRowStatus(currentRow,\'new\');" data-toggle="popover" title="Mark this row as new">' +
                                                                  '<i class="glyphicon glyphicon-star"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-default btn-sm" data-ng-click="setRowStatus(currentRow,\'\');" data-toggle="popover" title="Reset to normal row">' +
                                                                  '<i class="glyphicon glyphicon-step-backward"></i>' +
                                                              '</a></b>' + 
                                      '</li>' +
                                      '<li>' +
                                        '<a class="btn btn-warning btn-sm" data-ng-click="setRowStatus(currentRow,\'tsrblock\');" data-toggle="popover" title="Block TSR Display">' +
                                                                  '<i class="glyphicon glyphicon-ban-circle"></i>' +
                                                              '</a></b>' +
                                      '</li>' +
                                    '</ul>' +
                                  '</li></ul>' +
                              '</td>' +
                          '</tr>' +
                      '</tbody>' +
                  '</table>';
  var rtemplate = '<div class="outer" style="width:{{currentTable.$.tableWidth}}"><div class="innera" style="width:{{currentTable.$.tableWidth}}">' +
                    '<table class="table table-bordered table-striped table-hover table-condensed" id="gaf-xml-tbl">' +
                      '<thead>' +
                      '<tr><th class="btn btr-primary" style="text-align:center" ng-repeat="cols in currentTable.column" id="{{cols.$.name}}" ng-init="colWidths.push({\'colname\':cols.$.name, \'colwidth\':cols.$.colSize.replace(\'px\',\'\')})" ng-hide="cols.$.name==\'rowStatus\'" class="repeat-animation" resizable r-directions="[\'right\']" r-flex="false" r-width="getColumnWidth(cols.$.name)">' +
                          '{{getColumnHeaders(cols.$.name)}}&nbsp;<a href="#"></a>' +
                      '</th></tr>' +
                      '</thead><p/><p/><p/>' +
                      '<tbody>' +
                          '<tr ng-repeat="row in currentTable.data | filter:searchText" track by $index ng-init="currentRow=row.rowIndex" ng-click="setSelected(currentRow)" ng-class="isRowStatusChanged(row)">' +
                              '<td ng-repeat="cols in currentTable.column" track by $index ng-hide="cols.$.name==\'rowStatus\'" id="{{cols.$.name}}" class="repeat-animation" ng-init="colInfo=getColInfo(cols.$.name);currentColumn=$index" style="width:{{getColumnWidth(cols.$.name)}}px;min-width:{{getColumnWidth(cols.$.name)}}px;max-width:{{getColumnWidth(cols.$.name)}}px;" resizable r-directions="[\'right\']" r-flex="false" r-width="getColumnWidth(cols.$.name)">' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'text\'">' +
                                    '<div ng-show="colInfo.hasOwnProperty(\'pattern\')">' +
                                      '<a href="#" buttons="no" editable-text="$parent.row[cols.$.name]" e-pattern="{{colInfo.pattern}}" e-required e-placeholder="cols.$.name">{{ $parent.row[cols.$.name] || \'empty\' }}</a>' +
                                    '</div>' +
                                    '<div ng-hide="colInfo.hasOwnProperty(\'pattern\')">' +
                                      '<a href="#" buttons="no" editable-text="$parent.row[cols.$.name]" e-required e-placeholder="cols.$.name">{{ $parent.row[cols.$.name] || \'empty\' }}</a>' +
                                    '</div>' +                                   
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'checkbox\'">' +
                                     '<gaf-checkbox-list editMode="read" ng-init="setupCheckBoxData($parent.row, cols.$.name,$parent.row[cols.$.name], colInfo.domain, \'_\', colInfo.domainValue)" />' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'textlist\'">' +
                                     '<gaf-text-list editMode="read" ng-init="setupTextListData($parent.row, cols.$.name,$parent.row[cols.$.name])" />' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'segment\'">' +
                                     '<gaf-Segment-Table editMode="read" ng-init="setupSegmentTabletData($parent.row, cols.$.name,$parent.row[cols.$.name])" />' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'checkboxopen\'">' +
                                    '<div ng-init="ddData = getLookupData(currentRow,cols.$.name)">' +
                                     '<gaf-checkbox-open-list editMode="read" ng-init="setupCheckBoxData($parent.row, cols.$.name,$parent.row[cols.$.name], ddData, \'_\', colInfo.domainValue)" />' +
                                    '</div>' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'textarea\'">' +
                                    '<a href="#" buttons="no" e-rows="7" e-cols="35" editable-textarea="$parent.row[cols.$.name]" e-required e-placeholder="cols.$.name">{{ $parent.row[cols.$.name] || \'empty\' }}</a>' +
                                  '</div>' +
                                  '<div class="text-center" ng-if="colInfo.displayAs===\'script\'" ng-class="{selected : currentRow === idSelectedVote}">' +
                                  '  <a href="#" buttons="no" e-rows="7" e-cols="35"  editable-textarea="$parent.row[cols.$.name].xml" e-required e-placeholder="cols.$.name">{{ $parent.row[cols.$.name].xml | limitTo:5 || \'empty\' }}</a>' +
                                  '  <a class="pull-right btn btn-primary" data-ng-click="blocklyRow=getRowIndex(currentRow);setBlocklyRowCol(blocklyRow,cols.$.name, $parent.row[cols.$.name]);openBlocklyEditor(\'lg\');">' +
                                  '   <i class="glyphicon glyphicon-pencil" toggle-data="toggle" title="Blockly Document"></i>' +
                                  '  </a>' +
                                  '</div>' +
                                  '<span ng-if="getColumnDisplayType(cols.$.name)===\'span\'" data-ng-model="$parent.row[cols.$.name]">{{$parent.row[cols.$.name]}}</span>' +
                              '</td>' +
                          '</tr>' +
                      '</tbody>' +
                  '</table></div></div>';
  var htemplate = '<table class="table table-bordered table-striped" id="gaf-xml-tbl">' +
                      '<thead>' +
                      '<th ng-repeat="cols in currentTable.column" ng-hide="cols.$.name==\'rowStatus\'" class="repeat-animation td-fixedwidth">' +
                          '{{getColumnHeaders(cols.$.name)}}&nbsp;<a href="#" custom-sort order="cols.$.name" sort="sort"></a>' +
                      '</th>' +
                      '</thead>' +
                  '</table>';
  

  return {
    restrict: 'AE',
    controller: controller,
    bindToController: true, //required in 1.3+ with controllerAs
    template: function($element, $attrs){
      if ($attrs.editmode === 'edit'){
        return etemplate;
      }else if ($attrs.editmode === 'header'){
        return htemplate;
      }else{
        return rtemplate;
      }
    },
    scope:'=',
    link: function(scope, element, attrs) {
         // element.on('click', function(onChangeEvent) {
         //    console.log('row clicked attrs......' + JSON.stringify(attrs));
         //    console.log('row clicked element......' + JSON.stringify(element));
         // });
      }
  };

});

angular.module('gafxmls').directive('onReadFile', ["$parse", function ($parse) {
   return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
         var fn = $parse(attrs.onReadFile);
 
         element.on('change', function(onChangeEvent) {
            var reader = new FileReader();
 
            reader.onload = function(onLoadEvent) {
               scope.$apply(function() {
                  fn(scope, {$fileContent:onLoadEvent.target.result});
               });
            };
 
            reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
         });
      }
   };
}]);
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
'use strict';

angular.module('globals').factory('Gafglobals', [
	function() {
		// Gafglobals service logic
		// ...

		var gafXmlGlobal = {gafxmlXSD:{}, gafxmlTables:{}, gafxmlNameMappings:{}, gafxmlTypes:{}};
		var screenData = [];
		var currentTable = {};		
		var currentlyEditing = [{editType:'EQ', allowed:false},{editType:'CC', allowed:false},{editType:'FT', allowed:false}];
		var scriptChanged = false;


		// Public API
		return {
			getCurrentlyEditing: function(editType){
				for (var e=0; e < currentlyEditing.length; e++){
					if (currentlyEditing[e].editType === editType){
						return currentlyEditing[e].allowed;
					}
				}
			},
			setCurrentlyEditing: function(editType, allowed){

				var editTypeFound=false;
				for (var e=0; e < currentlyEditing.length; e++){
					if (currentlyEditing[e].editType === editType){
						currentlyEditing[e].allowed = allowed;
						editTypeFound = true;
						break;
					}
				}
				if (!editTypeFound){
					currentlyEditing.push({editType:editType, allowed:allowed});
				}

			},
			getGafGlobals: function() {
				return gafXmlGlobal;
			},
			setCurrentTable: function(tbl) {
				currentTable = tbl;
			},
			getGafScriptChanged: function() {
				return scriptChanged;
			},
			setGafScriptChanged: function(schange) {
				scriptChanged = schange;
			},
			getCurrentTable: function() {
				return currentTable;
			},
			setGafGlobals: function(globs) {
				gafXmlGlobal = globs;
			},
			getColumnHeaders: function(col){
		      for (var i=0, len=gafXmlGlobal.gafxmlNameMappings[0].mapping.length; i < len; i++){
		        var cName = gafXmlGlobal.gafxmlNameMappings[0].mapping[i].$.name;
		        if (cName === col){
		          return gafXmlGlobal.gafxmlNameMappings[0].mapping[i]._;
		        }
			  }
			},
			getColumnDisplayType: function(col){
				for (var t=0, tlen=gafXmlGlobal.gafxmlTables.length; t < tlen; t++){

					var cols = gafXmlGlobal.gafxmlTables[t].column;

					var baseType='';


					for (var c=0, clen=cols.length; c<clen; c++){
						if (cols[c].$.name === col){
							baseType = cols[c].$.type;
							break;
						}
					}

					for (var i=0, len=gafXmlGlobal.gafxmlTypes.length; i < len; i++){
				        var cName = gafXmlGlobal.gafxmlTypes[i].$.name;
				        if (cName === baseType){
				          return gafXmlGlobal.gafxmlTypes[i].$.displayAs;
				        }
					}

				}
		      
			},
			getScreenDataStructure: function(){
				if (screenData.length < 1){

					for (var i=0, len=gafXmlGlobal.gafxmlTables.length; i < len; i++){
						var tbl = {}, ctbl = gafXmlGlobal.gafxmlTables[i];
				        var cols = [];
				        var dataRows=[], dataItems={};

				        tbl.number = ctbl.$.number;
				        tbl.name = ctbl.$.name;
				        tbl.displayName = ctbl.$.displayName;
				        for (var j=0, jlen=ctbl.column.length; j < jlen; j++){
				          var col = ctbl.column[j];
				          cols.push({name:col.$.name, value:[]});
				          dataItems[col.$.name] = '';
				        }
				        tbl.column = cols;
				        ctbl.data = [];
				        ctbl.data[0] = dataItems;
				        screenData.push(ctbl);
					}

				}
				
				return screenData;
			},
			utf8_encode: function(argString) {
			  //  discuss at: http://phpjs.org/functions/utf8_encode/
			  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
			  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			  // improved by: sowberry
			  // improved by: Jack
			  // improved by: Yves Sucaet
			  // improved by: kirilloid
			  // bugfixed by: Onno Marsman
			  // bugfixed by: Onno Marsman
			  // bugfixed by: Ulrich
			  // bugfixed by: Rafal Kukawski
			  // bugfixed by: kirilloid
			  //   example 1: utf8_encode('Kevin van Zonneveld');
			  //   returns 1: 'Kevin van Zonneveld'

			  if (argString === null || typeof argString === 'undefined') {
			    return '';
			  }

			  var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
			  var utftext = '',
			    start, end, stringl = 0;

			  start = end = 0;
			  stringl = string.length;
			  for (var n = 0; n < stringl; n++) {
			    var c1 = string.charCodeAt(n);
			    var enc = null;

			    if (c1 < 128) {
			      end++;
			    } else if (c1 > 127 && c1 < 2048) {
			      enc = String.fromCharCode(
			        (c1 >> 6) | 192, (c1 & 63) | 128
			      );
			    } else if ((c1 & 0xF800) !== 0xD800) {
			      enc = String.fromCharCode(
			        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			      );
			    } else { // surrogate pairs
			      if ((c1 & 0xFC00) !== 0xD800) {
			        throw new RangeError('Unmatched trail surrogate at ' + n);
			      }
			      var c2 = string.charCodeAt(++n);
			      if ((c2 & 0xFC00) !== 0xDC00) {
			        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
			      }
			      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
			      enc = String.fromCharCode(
			        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			      );
			    }
			    if (enc !== null) {
			      if (end > start) {
			        utftext += string.slice(start, end);
			      }
			      utftext += enc;
			      start = end = n + 1;
			    }
			  }

			  if (end > start) {
			    utftext += string.slice(start, stringl);
			  }

			  return utftext;
			},
			getColInfo: function(col) {
				var colInfo = {};
				for (var t=0, tlen=gafXmlGlobal.gafxmlTables.length; t < tlen; t++){

					var cols = gafXmlGlobal.gafxmlTables[t].column;

					var baseType='';

					if (gafXmlGlobal.gafxmlTables[t].$.name !== currentTable.$.name) continue;


					for (var c=0, clen=cols.length; c<clen; c++){
						if (cols[c].$.name === col){
							baseType = cols[c].$.type;

							// if (baseType==='script'){
								if (cols[c].hasOwnProperty('varTable')){

							          colInfo.varTable = [];
							          for (var v=0, vlen=cols[c].varTable.length;v<vlen;v++){

							          	var tblInfo={};

							          	if (cols[c].varTable[v].filterVarTable === undefined){
							          	
							          		tblInfo = {tblName:cols[c].varTable[v].$.name, colName:cols[c].varTable[v].$.varColumn};

							          	}else{
							          	
							          		tblInfo = {tblName:cols[c].varTable[v].$.name, colName:cols[c].varTable[v].$.varColumn, filter:cols[c].varTable[v].filterVarTable};

							          	}
						          		if (cols[c].varTable[v].$.hasOwnProperty('varMatchColumn')){
						          			tblInfo.varMatchColumn = cols[c].varTable[v].$.varMatchColumn;
						          		}

							          	if (cols[c].varTable[v].$.hasOwnProperty('storageType')){
							          		tblInfo.storageType = cols[c].varTable[v].$.storageType;
							          	}else{
							          		tblInfo.storageType = 'NEPARM';
							          	}

						        		// if (cols[c].varTable[v].hasOwnProperty('isSegmented')){tblInfo.isSegmented='true';}
							          	colInfo.varTable.push(tblInfo);

							          }							          

						        }

							// }

							break;
						}
					}



					for (var i=0, len=gafXmlGlobal.gafxmlTypes.length; i < len; i++){
				        var cName = gafXmlGlobal.gafxmlTypes[i].$.name;
				        if (cName === baseType){
				          colInfo.displayAs = gafXmlGlobal.gafxmlTypes[i].$.displayAs;
				          if (gafXmlGlobal.gafxmlTypes[i].$.hasOwnProperty('domain')){

					          colInfo.domain = gafXmlGlobal.gafxmlXSD.guiData[gafXmlGlobal.gafxmlTypes[i].$.domain][0].mapping;
					          colInfo.domainValue = gafXmlGlobal.gafxmlXSD.guiData[gafXmlGlobal.gafxmlTypes[i].$.domain][0].$.mapValue;

				          }
				          if (gafXmlGlobal.gafxmlTypes[i].hasOwnProperty('pattern')){

					          colInfo.pattern = gafXmlGlobal.gafxmlTypes[i].pattern[0];

				          }
				          if (gafXmlGlobal.gafxmlTypes[i].$.pattern !== undefined){

					          colInfo.pattern = gafXmlGlobal.gafxmlTypes[i].$.pattern;

				          }
				          break;
				        }
					}

					

				}
				return colInfo;
			}
		};
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				// $location.path('/');
				 $location.path('/gafxmls');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);