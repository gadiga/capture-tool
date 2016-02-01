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