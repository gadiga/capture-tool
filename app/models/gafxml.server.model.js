'use strict';

/**
 * Module dependencies.
 */

 /*
 [
 {"number":"3-1","name":"releaseToIssueMap",
 "columns":[{"name":"release","value":""},{"name":"neIssue","value":""}]},
 {"number":"3-2","name":"neSummary",
 "columns":[{"name":"fieldName","value":""},{"name":"validValues","value":""},{"name":"neValue","value":""},{"name":"notes","value":""}]},
 {"number":"3-7","name":"equipProv",
 "columns":[{"name":"issue","value":""},{"name":"devcd","value":""},{"name":"devId-unitMapping","value":""},{"name":"devidRange","value":""},{"name":"unitId-frameData","value":""},{"name":"protectDevId","value":""},{"name":"parentDevcd","value":""},{"name":"parentDevid","value":""},{"name":"temsAction","value":""},{"name":"provCmd","value":""},{"name":"tl1AID","value":""}]}]
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/*
var indexData = new Schema({
	vendor:{
		type: String,
		required: 'Please enter valid Vendor',
		trim: true
	},
	model:{
		type: String,
		required: 'Please enter valid Model',
		trim: true
	},
	issue:{
		type: String,
		required: 'Please enter valid Issue',
		trim: true
	},
	version:{
		type: String,
		required: 'Please enter valid Version letter',
		trim: true
	}
});
*/

/**
 * A Validation function for local strategy password
 */
var validateInput = function(fieldValue) {
	console.log('fieldValue =====' + fieldValue);
	if (fieldValue === '' || fieldValue === null) return false;
	return true;
};

var tabcat = 'EQ CC FT'.split();

var table = new Schema({
	_number:{
		type: String,
		trim: true
	},
	_name:{
		type: String,
		trim: true
	},
	_displayName:{
		type: String,
		trim: true
	},
	_tableCategory:{
		type: String,
		enum: tabcat,
		trim: true
	},
	_appRelease:{
		type: String,
		trim: true
	}
},{strict: false});

/**
 * Gafxml Schema
 */
var GafxmlSchema = new Schema({
	vendor:{
		type: String,
		required: 'Please enter valid Vendor',
		trim: true
	},
	model:{
		type: String,
		required: 'Please enter valid Model',
		trim: true
	},
	issue:{
		type: String,
		required: 'Please enter valid Issue',
		trim: true
	},
	version:{
		type: String,
		required: 'Please enter valid Version letter',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updated: {
		type: Date
	},
	updateUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	editUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	edited: {
		type: Date
	},
	eqUpdated: {
		type: Date
	},
	eqUpdateUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	eqEditUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	eqEdited: {
		type: Date
	},
	ccUpdated: {
		type: Date
	},
	ccUpdateUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ccEditUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ccEdited: {
		type: Date
	},
	ftUpdated: {
		type: Date
	},
	ftUpdateUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ftEditUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ftEdited: {
		type: Date
	},
	publishUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	published: {
		type: Date
	},
	freezeDocUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	freezeDoc: {
		type: Date
	},
	tables: [table]
}, {collection: 'gafxmls',
    toObject: {
      retainKeyOrder: true
    },
    toJSON: {
      retainKeyOrder: true
    }});

mongoose.model('Gafxml', GafxmlSchema);