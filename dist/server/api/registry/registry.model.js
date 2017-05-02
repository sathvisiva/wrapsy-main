'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Product = require('../product/product.model').product;

var RegistryProductSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    index: true
  },
  desired: {
    type: Number,
    min: 0
  },
  required: {
    type: Number,
    min: 0
  }

});

var RegistrySchema = new Schema({
  title: {
    type: String
  },
  username: {
    type: String
  },
  date: {
    type: Date,
    'default': Date.now
  },
  location: {
    type: String
  },
  type: {
    type: String
  },
  message: {
    type: String
  },
  youfirstName: {
    type: String
  },
  yousecondName: {
    type: String
  },
  firstName: {
    type: String
  },
  secondName: {
    type: String
  },
  backgroundImageUrl: {
    type: String
  },
  profileImageUrl: {
    type: String
  },
  visible: {
    type: Boolean,
    'default': false
  },
  products: [{
    _id: String,
    name: String,
    slug: String,
    price: Number,
    desired: {
      type: Number,
      min: 0
    },
    required: {
      type: Number,
      min: 0
    }

  }]

}, { versionKey: false });

module.exports = {
  registry: mongoose.model('Registry', RegistrySchema),
  registryProduct: mongoose.model('RegistryProduct', RegistryProductSchema)
};
//# sourceMappingURL=registry.model.js.map
