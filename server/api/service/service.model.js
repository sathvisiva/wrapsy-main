'use strict';

import mongoose from 'mongoose';
var slugs = require('mongoose-url-slugs');

var Schema = mongoose.Schema;

/**
 * Todo Schema
 */
 var ServiceSchema = new Schema({
   title: String,
   imageUrl: String,
   active: {
    type : Boolean,
    default : true
  },
  createdAt : {
    type: Date, 
    default: Date.now
  }
});

 var ServiceVendorSchema = new Schema({
  name: String,
  email: String,
  phone: Number,
  imageUrl : String,
  website : String,
  watsapp : Number,
  facebook : String,
  instagram : String,
  pinterst : String,
  detail : String,
  service: { type: Schema.Types.ObjectId, ref: 'Service' },
  createdAt : {
    type: Date, 
    default: Date.now
  }
});


 ServiceSchema.plugin(slugs('title'));
 ServiceVendorSchema.plugin(slugs('name'));

 module.exports = {
  service: mongoose.model('Service', ServiceSchema),
  serviceVendor: mongoose.model('ServiceVendor', ServiceVendorSchema)
}
