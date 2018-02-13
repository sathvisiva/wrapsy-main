'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeatureSchema = new Schema({
  key: String,
  val: String,

});

module.exports = mongoose.model('Feature', FeatureSchema);
