'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var PaymentSchema = new mongoose.Schema({
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
	}
});

exports['default'] = mongoose.model('Payment', PaymentSchema);
module.exports = exports['default'];
//# sourceMappingURL=payment.model.js.map
