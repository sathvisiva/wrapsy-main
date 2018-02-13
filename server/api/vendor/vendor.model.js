'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var VendorSchema = new mongoose.Schema({
	name: String,
	mail: String,
	phone: String,
	gstin: String, 
	commision : Number,
	address : String
});

export default mongoose.model('Vendor', VendorSchema);
