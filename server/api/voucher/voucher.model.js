'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema

var VoucherSchema = new Schema({
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

	applied : {
		type: Boolean,
		default: false
	},
	
	paid : {
		type: Boolean,
		default: false
	},
	txn : {
		type: Schema.Types.ObjectId,
		ref: 'PaymentSchema'
	},
});

export default mongoose.model('Voucher', VoucherSchema);
