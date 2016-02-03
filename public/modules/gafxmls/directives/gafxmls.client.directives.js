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

  var cbController = function ($scope) {

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
          
              
      }; 

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

  var cbController = function ($scope) {

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
          
              
      }; 

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

  var tlController = function ($scope) {

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
          
              
      }; 

  var defTemplate = '<table class="table table-bordered table-hover table-condensed">' +
                    '<tr>' +
                    ' <td><button class="btn btn-xs btn-success" ng-click="addRow()">Add row</button></td>' +
                    '</tr>' +
                    ' <tr ng-repeat="item in tlItems">' +
                    '   <td>' +
                    // '<div ng-show="colInfo.hasOwnProperty(\'pattern\')">' +
                      '     <span editable-text="item.value" e-style="width:150px" e-pattern="{{colInfo.pattern}}" onbeforesave="checkTLData($data, tlItems.id)" e-name="tLData" e-form="rowform" e-required>' +
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

  var tlController = function ($scope, $filter) {

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
          
              
      }; 

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

  var segmentController = function ($scope, $filter, $window) {

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
  }; 

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

  var controller = function ($scope, $window) {
          
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
              
      }; 

  var template = '<tr><td ng-repeat="item in datasource"><input type="text" /></td></tr>';
  var buttons = '<div><input type="button" class="btn btn-sm btn-primary" ng-click="showModel(currentTable)" title="Show Model"/></div>';
  var search = '<div class="well well-sm">' +
                '  <span class="label label-primary">Search</span>' +
                '  <input type="text" size="35" ng-model="searchText">' +
                '</div>';
  var etemplate = '<div class="outer" style="width:{{currentTable.$.tableWidth}}"><div class="innera" style="width:{{currentTable.$.tableWidth}}">' +
                    '<table class="table table-bordered table-striped table-hover table-condensed">' +
                      '<thead><th class="btn btr-primary" style="width:100px; text-align:center"' +
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
                      '<th class="btn btr-primary" style="width:100px; text-align:center">' +
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

angular.module('gafxmls').directive('onReadFile', function ($parse) {
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
});
