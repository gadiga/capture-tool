'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Gafxml = mongoose.model('Gafxml'),
	_ = require('lodash');


function createFile(jsonData){

    var data;
    var fs = require('fs');
    

	var filespath = __dirname + '/' + 'sampledata.json';
	fs.writeFileSync(filespath, JSON.stringify(jsonData));
	
	// res.send(results);
}

/**
 * Create a Gafxml
 */
exports.create = function(req, res) {
	var gafxml = new Gafxml(req.body);
	gafxml.user = req.user;

	// console.log(JSON.stringify(gafxml));

	gafxml.save(function(err) {
		if (err) {
			console.log(errorHandler.getErrorMessage(err));
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gafxml);
		}
	});
};

/**
 * Show the current Gafxml
 */
exports.read = function(req, res) {
	res.jsonp(req.gafxml);
};

/**
 * Update a Gafxml
 */
exports.update = function(req, res) {
	console.log('doing updates....');
	var gafxml = req.gafxml ;
	// var gafxml = req.body;
	
	gafxml = _.extend(gafxml , req.body);

	var query = {'_id': gafxml._id};
	var update = {};
	var tabset = {};
	// { $set: { "tables.0.table.data": '',"tables.22.table.data": '' } 
	var eqAllowed = (gafxml.eqEditUser===undefined ? false : JSON.stringify(gafxml.eqEditUser)===JSON.stringify(req.user._id) || JSON.stringify(gafxml.eqEditUser._id)===JSON.stringify(req.user._id));
	var ccAllowed = (gafxml.ccEditUser===undefined ? false : JSON.stringify(gafxml.ccEditUser)===JSON.stringify(req.user._id) || JSON.stringify(gafxml.ccEditUser._id)===JSON.stringify(req.user._id));
	var ftAllowed = (gafxml.ftEditUser===undefined ? false : JSON.stringify(gafxml.ftEditUser)===JSON.stringify(req.user._id) || JSON.stringify(gafxml.ftEditUser._id)===JSON.stringify(req.user._id));
	for (var t=0, tlen = gafxml.tables.length; t < tlen; t++){
		
		var table = {};
		var queryUpate = false;
		var eqUpdate = (eqAllowed && req.body.tables[t].table._tableCategory === 'EQ');
		var ccUpdate = (ccAllowed && req.body.tables[t].table._tableCategory === 'CC');
		var ftUpdate = (ftAllowed && req.body.tables[t].table._tableCategory === 'FT');

		// console.log('looping to update....' + req.body.tables[t].table._tableCategory);
		// console.log('eqallowed=' + eqUpdate + ' ccallowed=' + ccUpdate + ' ftallowed=' + ftUpdate);

		if (eqUpdate){
			console.log('adding EQ to update....');
			queryUpate = true;
			tabset['eqUpdateUser']=req.user._id;
			tabset['eqUpdated'] = Date();

			
		}
		if (ccUpdate){
			console.log('adding CC to update....');
			queryUpate = true;
			tabset['ccUpdateUser']=req.user._id;
			tabset['ccUpdated'] = Date();
		}
		if (ftUpdate){
			console.log('adding FT to update....');
			queryUpate = true;
			tabset['ftUpdateUser']=req.user._id;
			tabset['ftUpdated'] = Date();
		}

		if (queryUpate){

			// table = req.body.tables[t].table;
			// if (tabset !== '{') tabset = tabset + ',';
			// tabset = tabset + 'tables.' + t + 'table.data:' + JSON.stringify(table.data);
			if (!req.body.tables[t].table.data || req.body.tables[t].table.data === undefined){
				queryUpate = false;
				continue;
			} 
			tabset['tables.' + t + '.table.data'] = req.body.tables[t].table.data;
			tabset['tables.' + t + '.table._description']=req.body.tables[t].table._description;
			tabset['tables.' + t + '.table._tableCategory']=req.body.tables[t].table._tableCategory;
      		if (req.body.tables[t].table.hasOwnProperty('img')){      			
      			console.log('image file');
				console.log(req.body.tables[t].table.img);
				tabset['tables.' + t + '.table.img']=req.body.tables[t].table.img;
      		}
			
			queryUpate = false; 


		}
	}

	if (tabset) {
		update = {$set:tabset};
	}


	var options = {upsert: true};
	Gafxml.findOneAndUpdate(query, update, options).populate('user updateUser editUser publishUser eqEditUser ccEditUser ftEditUser eqUpdateUser ccUpdateUser ftUpdateUser', 'displayName displayName displayName displayName displayName displayName displayName displayName displayName displayName').exec(function(err, gafxml) {
		if (err) {console.log('An error occured while updating...');console.log(err);}
		if (! gafxml) {console.log('Failed to update the document Gafxml ');}
		console.log('document updated.....');	
		res.jsonp(gafxml);		
	});
	/*
	var gafxml = req.gafxml ;

	gafxml = _.extend(gafxml , req.body);

	gafxml.updateUser = req.user;
	gafxml.updated = Date();

	console.log(JSON.stringify(req.user));

	gafxml.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gafxml);
		}
	});
	*/
};

/**
 * Update a Gafxml by closing the document. remove the editUser
 */


exports.closeDocument = function(req, res) {
	var gafxml = req.body;

	// gafxml = _.extend(gafxml , req.body);

	
	var eqAllowed = gafxml.eqEditUser===undefined ? false : (req.user.id === gafxml.eqEditUser || req.user.id === gafxml.eqEditUser._id);
	var ccAllowed = gafxml.ccEditUser===undefined ? false : (req.user.id === gafxml.ccEditUser || req.user.id === gafxml.ccEditUser._id);
	var ftAllowed = gafxml.ftEditUser===undefined ? false : (req.user.id === gafxml.ftEditUser || req.user.id === gafxml.ftEditUser._id);

	if ( eqAllowed || ccAllowed || ftAllowed){
		console.log('closing the doc as editor');

		var query = {'_id': gafxml._id};
		// var update = {$inc: {_v:1}};
		var update = { $unset: {editUser : '', edited : '' } };

		if (eqAllowed){
			console.log('closing the doc as editor...' + gafxml.eqEditUser);
			update.$unset.eqEditUser = '';
			update.$unset.eqEdited = '';
		}
		if (ccAllowed){
			console.log('closing the doc as editor...' + gafxml.ccEditUser);
			update.$unset.ccEditUser = '';
			update.$unset.ccEdited = '';
		}
		if (ftAllowed){
			console.log('closing the doc as editor...' + gafxml.ftEditUser);
			update.$unset.ftEditUser = '';
			update.$unset.ftEdited = '';
		}
		// var update = { _v : 22 };
		var options = {upsert: true};
		Gafxml.findOneAndUpdate(query, update, options).populate('user updateUser editUser publishUser eqEditUser ccEditUser ftEditUser eqUpdateUser ccUpdateUser ftUpdateUser', 'displayName displayName displayName displayName displayName displayName displayName displayName displayName displayName').exec(function(err, gafxml) {
			if (err) {console.log('An error occured while closing...');console.log(err);}
			if (! gafxml) {console.log('Failed to close the document Gafxml ');}
			console.log('document closed.....');
			res.jsonp(gafxml);

		});

	}else{
		console.log('WARNING----- id did not match for doc close');
		console.log(gafxml.eqEditUser===undefined ? 'eqempty' : gafxml.eqEditUser._id);
		console.log(gafxml.ccEditUser===undefined ? 'ccempty' : gafxml.ccEditUser._id);
		console.log(gafxml.ftEditUser===undefined ? 'ftempty' : gafxml.ftEditUser._id);
		console.log('req=' + req.user.id);

	}
};


/**
 * Update a Gafxml by publishing the document.
 */


exports.publishDocument = function(req, res) {
	var gafxml = req.body;
	gafxml.updateUser = req.user.id;
	gafxml.updated = Date();

	// gafxml = _.extend(gafxml , req.body);

	// if (gafxml.editUser._id === req.user.id){
		console.log('publishing the doc as editor');

		var query = {'_id': gafxml._id};
		// var update = {$inc: {_v:1}};
		var update = { $set: {publishUser : gafxml.updateUser, published : gafxml.updated } };
		// var update = { _v : 22 };
		var options = {upsert: false};
		Gafxml.findOneAndUpdate(query, update, options).populate('user updateUser publishUser', 'displayName displayName displayName').exec(function(err, gafxml) {
			if (err) {console.log('An error occured while publishing...');console.log(err);}
			if (! gafxml) {console.log('Failed to publish the document Gafxml ');}
			console.log('document published.....');			
		});
};

/**
 * Update a Gafxml by freeze the document.
 */


exports.freezeDocument = function(req, res) {
	var gafxml = req.body;
	gafxml.updateUser = req.user.id;
	gafxml.updated = Date();

	// gafxml = _.extend(gafxml , req.body);

	// if (gafxml.editUser._id === req.user.id){
		console.log('freezing the doc as editor');

		var query = {'_id': gafxml._id};
		// var update = {$inc: {_v:1}};
		var update = { $set: {freezeDocUser : gafxml.updateUser, freezeDoc : gafxml.updated } };
		// var update = { _v : 22 };
		var options = {upsert: false};
		Gafxml.findOneAndUpdate(query, update, options).populate('user updateUser publishUser freezeDocUser', 'displayName displayName displayName displayName').exec(function(err, gafxml) {
			if (err) {console.log('An error occured while freezing...');console.log(err);}
			if (! gafxml) {console.log('Failed to freezing the document Gafxml ');}
			console.log('document frozen.....');	
			res.jsonp(gafxml);		
		});
};

/**
 * Update a Gafxml by edit the document.
 */


exports.editDocument = function(req, res) {
	var gafxml = req.body;
	gafxml.updateUser = req.user.id;
	gafxml.updated = Date();

	// gafxml = _.extend(gafxml , req.body);
	
	var update = {};
	var editable = false;

	if (gafxml.eqEditUser){
		console.log('updating editEQ user...');
		
		if (gafxml.eqEditUser._id === req.user.id) {
			editable = true;
			update.eqEditUser = req.user._id;
			update.eqEdited = Date();
		}
	}
	if (gafxml.ccEditUser){
		console.log('updating editCC user...');
		if (gafxml.ccEditUser._id === req.user.id) {
			editable = true;
			update.ccEditUser = req.user._id;
			update.ccEdited = Date();
		}
	}
	if (gafxml.ftEditUser){
		console.log('updating editFT user...');
		if (gafxml.ftEditUser._id === req.user.id) {
			editable = true;
			update.ftEditUser = req.user._id;
			update.ftEdited = Date();
		}
	}

	if (editable){
		console.log('editing the doc as editor');

		var query = {'_id': gafxml._id};
		// var update = {$inc: {_v:1}};
		var updateQry = { $set: update };
		// var update = { _v : 22 };
		var options = {upsert: false};
		Gafxml.findOneAndUpdate(query, updateQry, options).populate('user updateUser editUser publishUser eqEditUser ccEditUser ftEditUser eqUpdateUser ccUpdateUser ftUpdateUser', 'displayName displayName displayName displayName displayName displayName displayName displayName displayName displayName').exec(function(err, gafxml) {
			if (err) {console.log('An error occured while editing...');console.log(err);}
			if (! gafxml) {console.log('Failed to edit the document Gafxml ');}
			console.log('document edited.....');			
		});
		res.jsonp(gafxml);

	}else{
		console.log('WARNING-----' + gafxml.editUser._id);
		console.log('WARNING-----' + req.user.id);

	}
};


/**
 * Update Equipment Tables for Gafxml
 */
exports.updateEquipment = function(req, res) {
	var gafxml = req.gafxml ;
	gafxml.updateUser = req.user;
	gafxml.updated = Date();

	gafxml = _.extend(gafxml , req.body);

	if (gafxml.editUser._id === req.user.id){
		console.log('closing the doc as editor');

		var query = {'_id': gafxml._id};
		// var update = {$inc: {_v:1}};
		var update = { $unset: {editUser : '', edited : '' } };
		// var update = { _v : 22 };
		var options = {upsert: true};
		Gafxml.findOneAndUpdate(query, update, options).populate('user updateUser', 'displayName displayName').exec(function(err, gafxml) {
			if (err) {console.log('An error occured while closing...');console.log(err);}
			if (! gafxml) {console.log('Failed to close the document Gafxml ');}
			console.log('document closed.....');			
		});

	}else{
		console.log('WARNING-----' + gafxml.editUser._id);
		console.log('WARNING-----' + req.user.id);

	}



	/*
	gafxml = _.extend(gafxml , req.body);

	// console.log(JSON.stringify(gafxml));

	gafxml.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gafxml);
		}
	});
	*/
};

/**
 * Update Cross Connect Tables for Gafxml
 */
exports.updateCrossConnect = function(req, res) {
	var gafxml = req.gafxml ;
	gafxml.updateUser = req.user;
	gafxml.updated = Date();



	gafxml = _.extend(gafxml , req.body);

	// console.log(JSON.stringify(gafxml));

	gafxml.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gafxml);
		}
	});
};

/**
 * Update Flowthru Tables for Gafxml
 */
exports.updateFlowthru = function(req, res) {
	var gafxml = req.gafxml ;
	gafxml.updateUser = req.user;
	gafxml.updated = Date();



	gafxml = _.extend(gafxml , req.body);

	// console.log(JSON.stringify(gafxml));

	gafxml.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gafxml);
		}
	});
};

/**
 * Delete an Gafxml
 */
exports.delete = function(req, res) {
	var gafxml = req.gafxml ;

	gafxml.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gafxml);
		}
	});
};

/**
 * List of Gafxmls
 */
exports.list = function(req, res) { 
	// console.log(JSON.stringify(req.body));
	Gafxml.find().select('-tables').sort('-created').populate('user updateUser editUser publishUser eqEditUser ccEditUser ftEditUser eqUpdateUser ccUpdateUser ftUpdateUser freezeDocUser', 'displayName displayName displayName displayName displayName displayName displayName displayName displayName displayName').exec(function(err, gafxmls) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gafxmls);
		}
	});
};

/**
 * Gafxml middleware
 */
exports.gafxmlByID = function(req, res, next, id) {
	if (!req.user){
		Gafxml.findById(id).populate('user updateUser editUser eqEditUser ccEditUser ftEditUser eqUpdateUser ccUpdateUser ftUpdateUser freezeDocUser', 'displayName displayName displayName displayName displayName displayName displayName displayName displayName displayName').exec(function(err, gafxml) {
			if (err) return next(err);
			if (! gafxml) return next(new Error('Failed to load Gafxml ' + id));
			req.gafxml = gafxml ;
			next();
		});
	}else{

		Gafxml.findById(id).populate('user updateUser editUser eqEditUser ccEditUser ftEditUser eqUpdateUser ccUpdateUser ftUpdateUser freezeDocUser', 'displayName displayName displayName displayName displayName displayName displayName displayName displayName displayName').exec(function(err, gafxml) {
			if (err) return next(err);
			if (! gafxml) return next(new Error('Failed to load Gafxml ' + id));

			if (!gafxml.editUser){
				console.log('Openeing doc as editor');

				var query = {'_id': id};
				// var update = {$inc: {_v:1}};
				var update = {editUser: req.user._id, edited:Date()};
				var options = {upsert: true};
				Gafxml.findOneAndUpdate(query, update, options).populate('user updateUser editUser eqEditUser ccEditUser ftEditUser eqUpdateUser ccUpdateUser ftUpdateUser freezeDocUser', 'displayName displayName displayName displayName displayName displayName displayName displayName displayName displayName').exec(function(err, gafxml) {
					if (err) return next(err);
					if (! gafxml) return next(new Error('Failed to load Gafxml ' + id));
					req.gafxml = gafxml ;
					next();
				});

			}else{
				console.log('Openeing doc as reader');
				req.gafxml = gafxml ;
				req.readOnly = true;
				next();
			}
			
		});
	
	// console.log(req.user);
		
	}
};

/**
 * Gafxml authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*if (req.gafxml.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
	next();
};
