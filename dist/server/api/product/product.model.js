'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var slugs = require('mongoose-url-slugs');

var ImageSchema = new Schema({
  imageUrl: {
    type: String
  },
  imageBin: {
    data: Buffer,
    contentType: String
  },
  featured: {
    type: Boolean,
    'default': false
  }
});

var FeatureSchema = new Schema({
  key: {
    type: String
  },
  value: [{
    type: String
  }]

});

var FilterSchema = new Schema({
  label: {
    type: String
  },
  value: [{
    type: String
  }]
});

var ReviewSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String
  },
  by: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  posted: {
    type: Date,
    'default': Date.now
  }
});

var ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String
  },
  vendor: {
    type: String
  },
  size: [{
    type: String
  }],
  color: [{
    type: String
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    'default': 1
  },
  featured: {
    type: Boolean,
    'default': false
  },
  hot: {
    type: Boolean,
    'default': false
  },
  'new': {
    type: Boolean,
    'default': false
  },
  imageUrl: {
    type: String
  },
  imageBin: {
    data: Buffer,
    contentType: String
  },
  description: String,
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'Image',
    index: true
  }],
  features: [{
    type: Schema.Types.ObjectId,
    ref: 'Feature',
    index: true
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review',
    index: true
  }],
  categories: {
    type: Schema.Types.ObjectId,
    ref: 'Catalog',
    index: true
  },
  prodcode: {
    type: String
  },
  linkId: {
    type: String
  },
  affiliate: {
    type: Boolean,
    'default': false
  },
  cgst: {
    type: Number,
    min: 0
  },
  sgst: {
    type: Number,
    'default': 1
  },
  dateadded: {
    type: Date,
    'default': Date.now
  }

}).index({
  'title': 'text',
  'description': 'text'
});

ProductSchema.plugin(slugs('title'));

module.exports = {
  product: mongoose.model('Product', ProductSchema),
  feature: mongoose.model('Feature', FeatureSchema),
  filter: mongoose.model('Filter', FilterSchema),
  image: mongoose.model('Image', ImageSchema),
  review: mongoose.model('Review', ReviewSchema)
  //FilterSchema
};
//# sourceMappingURL=product.model.js.map
