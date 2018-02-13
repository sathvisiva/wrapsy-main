'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import { Schema } from 'mongoose';
var autoIncrement = require('mongoose-auto-increment');
import config from '../../config/environment';

autoIncrement.initialize(mongoose.createConnection(config.mongo.uri));



var RequestSchema = new Schema({
	requestNumber: String,
	customerId: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	orderId: {
		type: Schema.Types.ObjectId,
		ref: "Order"
	},
	products : {
		type: Schema.Types.ObjectId,
		ref: "Product"
	}, 
	return : {
		type: Boolean,
		default: false
	} ,
	cancel :{
		type: Boolean,
		default: false
	},
	reason : {
		type : String
	},  
	processed: {
		type: Boolean,
		default: false
	},
	approved: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	}
});

RequestSchema.plugin(autoIncrement.plugin, {
	model: 'Request',
	field: 'requestNumber',
	startAt: 700000,
	incrementBy: 1
});

export default mongoose.model('Request', RequestSchema);

