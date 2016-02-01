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