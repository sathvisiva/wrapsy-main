'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mongoose = require('mongoose');

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var UploadSchema = new mongoose.Schema({
  url: String,
  active: Boolean
});

exports['default'] = mongoose.model('Upload', UploadSchema);
module.exports = exports['default'];
//# sourceMappingURL=upload.model.js.map
