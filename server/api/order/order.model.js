'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var autoIncrement = require('mongoose-auto-increment');
import config from '../../config/environment';
var Schema = mongoose.Schema

autoIncrement.initialize(mongoose.createConnection(config.mongo.uri));

var OrderItemSchema = new Schema({
 quantity: Number,  
 registry :  String,
 features : Array,
 status : String,
 products: {
  type: Schema.Types.ObjectId,
  ref: 'Product'
},
returnrequest : {
  type: Schema.Types.ObjectId,
  ref: 'RequestSchema'
},
subtotal : Number,
statusChangeHistory : [{
  status : String,
  datemodified : {
    type: Date,
    default: Date.now
  }

}]

});

var OrderSchema = new Schema({
  orderNumber: String,
  shipping: Number,
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
  vouchers: {
    type: Schema.Types.ObjectId,
    ref: 'Voucher'
  },  
  status: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  delivered: {
    type: Date,
  },
  paid : {
    type: Boolean,
    default: false
  },
  txn : {
    type: Schema.Types.ObjectId,
    ref: 'PaymentSchema'
  },
  cancelrequest : {
    type: Schema.Types.ObjectId,
    ref: 'RequestSchema'
  },
  paidbycontribution : [{
    type: Schema.Types.ObjectId,
    ref: 'ContributionsSchema'
  }],
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
