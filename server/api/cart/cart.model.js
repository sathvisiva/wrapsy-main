'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import config from '../../config/environment';
var Product = require('../product/product.model').product;
var Schema = mongoose.Schema

var CartItemSchema = new Schema({

  quantity: Number,  
  registry :  String,
  features : Array,
  products: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  subtotal : Number
});

var CartSchema = new Schema({
  _id : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [CartItemSchema],
  vouchers: {
    type: Schema.Types.ObjectId,
    ref: 'Voucher'
  },  
  last_modified: {
    type: Date,
    default: Date.now
  },
  shipping : {
    type : Number,
    default :  50
  }
});



export default mongoose.model('Cart', CartSchema);
