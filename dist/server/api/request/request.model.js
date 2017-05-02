'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mongoose = require('mongoose');

var _configEnvironment = require('../../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.createConnection(_configEnvironment2['default'].mongo.uri));

var RequestItemSchema = new _mongoose.Schema({
  description: String,
  price: Number,
  quantity: Number,
  total: Number
});

var RequestSchema = new _mongoose.Schema({
  requestNumber: String,
  customerId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [RequestItemSchema],
  customerName: String,
  customerEmail: String,
  customerAddress: String,
  customerPhone: String,
  customerCity: String,
  customerState: String,
  customerCountry: String,
  listSubTotal: Number,
  listCharge: Number,
  listTotal: Number,
  processed: {
    type: Boolean,
    'default': false
  },
  created: {
    type: Date,
    'default': Date.now
  }
});

RequestSchema.plugin(autoIncrement.plugin, {
  model: 'Request',
  field: 'requestNumber',
  startAt: 700000,
  incrementBy: 1
});

exports['default'] = mongoose.model('Request', RequestSchema);
module.exports = exports['default'];
//# sourceMappingURL=request.model.js.map
