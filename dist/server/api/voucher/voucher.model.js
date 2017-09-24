'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var VoucherSchema = new mongoose.Schema({
	amount: Number,
	email: {
		type: String
	},
	validuntil: {
		type: Date,
		'default': Date.now
	},
	code: {
		type: String
	},
	redeemed: {
		type: Boolean,
		'default': false
	},
	paid: {
		type: Boolean,
		'default': false
	},
	paymentId: String
});

exports['default'] = mongoose.model('Voucher', VoucherSchema);
module.exports = exports['default'];
//# sourceMappingURL=voucher.model.js.map
