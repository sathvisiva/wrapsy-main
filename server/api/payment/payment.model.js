'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var PaymentSchema = new mongoose.Schema({
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
});

export default mongoose.model('Payment', PaymentSchema);
