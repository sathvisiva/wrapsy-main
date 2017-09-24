'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _configEnvironment = require('../../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.createConnection(_configEnvironment2['default'].mongo.uri));

var OrderItemSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number,
  total: Number,
  registry: String,
  size: String,
  color: String,
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
    'default': Date.now
  },
  delivered: {
    type: Date,
    'default': Date.now
  },
  paid: {
    type: Boolean,
    'default': false
  },
  paidbyVoucher: { type: Number,
    min: 0,
    'default': 0 }
});

OrderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'orderNumber',
  startAt: 400000,
  incrementBy: 1
});

exports['default'] = mongoose.model('Order', OrderSchema);
module.exports = exports['default'];
//# sourceMappingURL=order.model.js.map
