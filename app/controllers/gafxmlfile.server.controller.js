'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

/**
 * Create a Gafxmlfile
 */
exports.create = function(req, res) {

	function getJSONConfig(filePath){

        var xml;
        
        try {
        	var fs = require('fs');
            var fileData = fs.readFileSync(filePath, 'utf-8');

            var json2xml = require('json2xml');
			xml = json2xml(JSON.parse(fileData), { header: true, attributes_key: '@' });
    		

	        // console.log('File ' + filePath + ' was successfully read.\n');
	        return xml;
	    } catch (ex) {console.log(ex);}
	}

	// var filespath = __dirname + '/' + 'config.json';
	var filespath = __dirname + '/' + 'gafxmltestdata2.json';
	var xjson = getJSONConfig(filespath);
	res.send(xjson);

};

/**
 * Show the current Gafxmlfile
 */
exports.read = function(req, res) {

	var fs = require('fs'), xml2js = require('xml2js');

	function getXMLConfig(filePath){

        var json;
        
        try {
            var fileData = fs.readFileSync(filePath, 'ascii');

            var parser = new xml2js.Parser({trim: true});
            parser.parseString(fileData, function (err, result) {
            	json = JSON.stringify(result);
	        });
	        return json;
	    } catch (ex) {console.log(ex);}
	}

	var filespath = __dirname + '/' + 'gafxmltemplate.xml';
	var xml = getXMLConfig(filespath);
	res.send(xml);

};

/**
 * Show the current Gafxmlfile
 */
exports.json2xml = function(req, res) {

	function getJSONConfig(fileData){

        var xml;
        
        try {
        	var json2xml = require('json2xml');
			// xml = json2xml(JSON.parse(fileData), { header: true });   		
			xml = json2xml(fileData, { header: true, attributes_key: '@' });

	        return xml;
	    } catch (ex) {console.log(ex);}
	}

	var filespath = req.body;
	// console.log(req.body);
	var xjson = getJSONConfig(filespath);
	// console.log(xjson);
	var results = {'xml':xjson};
	res.send(results);

};

/**
 * Update a Gafxmlfile
 */
exports.update = function(req, res) {

};

/**
 * Delete an Gafxmlfile
 */
exports.delete = function(req, res) {

};

/**
 * List of Gafxmlfiles
 */
exports.list = function(req, res) {

};