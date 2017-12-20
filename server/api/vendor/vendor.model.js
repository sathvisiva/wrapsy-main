'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import { Schema } from 'mongoose';
var autoIncrement = require('mongoose-auto-increment');
import config from '../../config/environment';

autoIncrement.initialize(mongoose.createConnection(config.mongo.uri));


var VendorSchema = new Schema({
  name: String,
  email: String,
  vendorAddress: String,
  vendorPhone: String,
  vendorCity: String,
  vendorState: String,
  commision: Number,
  created: {
    type: Date,
    default: Date.now
  },
  status : {
    type: Boolean,
    default: true
  },
});

VendorSchema.plugin(autoIncrement.plugin, {
  model: 'Request',
  field: 'requestNumber',
  startAt: 700000,
  incrementBy: 1
});

export default mongoose.model('Vendor', VendorSchema);
