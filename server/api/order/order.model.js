'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var autoIncrement = require('mongoose-auto-increment');
import config from '../../config/environment';
var Schema = mongoose.Schema

autoIncrement.initialize(mongoose.createConnection(config.mongo.uri));

var OrderItemSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
  registry :  String,
  size : String,
  color : String,
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
});

var OrderSchema = new Schema({
  orderNumber: String,
  shipping: Number,
  tax: Number,
  subTotal: Number,
  totalCost: Number,
  items: [OrderItemSchema],
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  vouchers: [{
    type: Schema.Types.ObjectId,
    ref: 'Voucher'
  }],  
  status: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  delivered: {
    type: Date,
    default: Date.now
  },
  paid : {
    type: Boolean,
    default: false
  },
  paidbyVoucher : { type: Number,
    min: 0,
    default : 0}
  });

OrderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'orderNumber',
  startAt: 400000,
  incrementBy: 1
});

export default mongoose.model('Order', OrderSchema);
