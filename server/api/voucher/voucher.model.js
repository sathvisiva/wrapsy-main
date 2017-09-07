'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var VoucherSchema = new mongoose.Schema({
	amount : Number,
	email: {
		type: String
	},
	validuntil: {
		type: Date,
		default: Date.now
	},
	code: {
		type: String
	},
	redeemed : {
		type: Boolean,
		default: false
	},
	paid : {
		type: Boolean,
		default: false
	},
	paymentId : String
});

export default mongoose.model('Voucher', VoucherSchema);
