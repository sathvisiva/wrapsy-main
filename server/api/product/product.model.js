'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema
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
    default: false
  }
});

var VariantSchema = new Schema({
  code: {
    type: String
  },
  price: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    min: 0
  },
  description: {
    type: String
  }
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
    default: Date.now
  }
});

var ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  affiliate : {
    type : Boolean,
    default : false
  },
  pageurl : {
    type : String
  },
  asin : {
    type : String
  },
  code: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  gst : {
    type : Number,
    default : 0
  },
  coverimage : String,
  discount : {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    default: 1
  },
  featured: {
    type: Boolean,
    default: false
  },
  shortdescription : String,
  description: String,
  features : [{
    key : String,
    val : [],
    selectable : {
      type: Boolean,
      default: false
    }
  }],
  vendor : {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    index: true
  },
  images: [{
    url : String,
    cover : {
      type: Boolean,
      default: false
    }
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
  }
}).index({
  'title': 'text',
  'description': 'text'
});

ProductSchema.plugin(slugs('title'));

module.exports = {
  product: mongoose.model('Product', ProductSchema),
  variant: mongoose.model('Variant', VariantSchema),
  image: mongoose.model('Image', ImageSchema),
  review: mongoose.model('Review', ReviewSchema)
}
