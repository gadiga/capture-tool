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


angular.module('gafxmls').controller('PublishXMLController', function ($window, $scope, $modalInstance, checkin) {

  

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

});

angular.module('gafxmls').controller('DeleteController', function ($window, $scope, $modalInstance, remove) {

  

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
});

angular.module('gafxmls').controller('SaveAckController', function ($window, $scope, $modalInstance, findOne) {

  $scope.saveStatus = 'Document Saving...';

  $scope.cancelDelete = function(){

		findOne();
		$modalInstance.dismiss('cancel');

  };
});


angular.module('gafxmls').controller('BlocklyController', function ($window, $scope, $modalInstance, saveScript, getScript) {

  

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
});

angular.module('gafxmls').controller('VMIToolController', function ($window, $scope, $modalInstance, getXML) {

  

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
});

angular.module('gafxmls').controller('TreeViewController', function ($window, $scope, $modalInstance, saveHierarchy, getHierarchy) {

  
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
});

angular.module('gafxmls').controller('LoaderController', function ($window, $scope, $modalInstance, loaderCreated) {

  
  

  $scope.cancelDelete = function(){

		$modalInstance.dismiss('cancel');

  };

  // return loaderCreated();
 
});
