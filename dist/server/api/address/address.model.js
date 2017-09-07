'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
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
	city: String,
	state: String,
	pincode: {
		type: Number,
		min: 6
	},
	registryId: String
});

exports['default'] = mongoose.model('Address', AddressSchema);
module.exports = exports['default'];
//# sourceMappingURL=address.model.js.map
