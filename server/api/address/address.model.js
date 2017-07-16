'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var AddressSchema = new mongoose.Schema({
	name: String,
	phoneNumber: {
		type: Number,
		min: 10
	},
	address1: String,
	address2: String,
	landmark: String,
	city : String,
	state : String,
	pincode: {
		type: Number,
		min: 6
	},
	registryId : String
});

export default mongoose.model('Address', AddressSchema);
