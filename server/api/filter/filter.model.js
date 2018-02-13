'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var FilterSchema = new mongoose.Schema({
	name: String,
	feature : String,
	value: [{
		type: String
	}]
	
});

export default mongoose.model('Filter', FilterSchema);
