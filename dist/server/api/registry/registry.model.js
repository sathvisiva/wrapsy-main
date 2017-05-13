'use strict';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var Product = require('../product/product.model').product;

var RsvpSchema = new Schema({
  name: {
    type: String,

    trim: true
  },
  email: {
    type: String
  },
  phone: {
    type: Number
  },
  attending: {
    type: Boolean,
    'default': true
  },
  people: {
    type: Number,
    min: 1,
    max: 10
  },
  posted: {
    type: Date,
    'default': Date.now
  },
  registryId: {
    type: String
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
  greeting: {
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
    _id: { type: String, unique: true },
    name: String,
    slug: String,
    imageUrl: String,
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

}, { versionKey: false }).index({
  'title': 'text'
});

module.exports = {
  registry: mongoose.model('Registry', RegistrySchema),
  rsvp: mongoose.model('Rsvp', RsvpSchema)
};
//# sourceMappingURL=registry.model.js.map
