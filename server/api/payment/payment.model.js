'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var PaymentSchema = new mongoose.Schema({
	mihpayid : String,
	mode : String,
	status : String,
	unmappedstatus : String,
	key  : String,
	txnid : String,
	amount : String,
	cardCategory : String,
	discount : String,
	net_amount_debit : String,
	addedon : String,
	productinfo : String,
	firstname :String,
	lastname : String,
	address1 : String,
	address2 : String,
	city : String,
	state : String,
	country : String,
	zipcode : String,
	email : String,
	phone : String,
	udf1 : String,
	hash : String,
	field1 : String,
	field2 : String,
	field3 : String,
	field4 : String,
	field5 : String,
	field6 : String,
	field7 : String,
	field8 : String,
	field9 : String,
	payment_source : String,
	PG_TYPE : String,
	bank_ref_num : String,
	bankcode : String,
	error : String,
	error_Message : String,
	name_on_card : String,
	cardnum : String,
	issuing_bank : String,
	card_type : String,	
	createdAt: {
		type: Date,
		default: Date.now
	}
	
});

export default mongoose.model('Payment', PaymentSchema);
