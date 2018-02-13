'use strict';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var slugs = require('mongoose-url-slugs');
var Product = require('../product/product.model').product;

var RegistryTypeSchema = new Schema({
  type: {
    type: String,    
    trim: true
  },
  thumbnail: {
    type: String
  },
  themes : [{
    background : {type : String},
    fontColor : {type : String}
  }]
});
var RsvpSchema = new Schema({
  name: {
    type: String,    
    trim: true
  },
  email: {
    type: String
  },
  phone : {
    type : Number
  },
  attending:  {
    type: Boolean,
    default: true
  },
  posted: {
    type: Date,
    default: Date.now
  },
  registryId : {
    type: String
  }
});

var GuestBookSchema = new Schema({
  wishes: {
    type: String
  },
  by: {
    type: String
  },
  posted: {
    type: Date,
    default: Date.now
  },
  registryId : {
    type: String
  }
});

var ContributionsSchema = new Schema({
  name: {
    type: String
  },
  productId: {
    type: String
  },
  contribution: {
    type: Number
  },
  registryId : {
    type: String
  },
  paymentid : {
    type: String
  },
  vouchers: [{
    type: Schema.Types.ObjectId,
    ref: 'Voucher'
  }]
});

var AccomodationSchema = new Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  email: {
    type: String
  },
  phone : {
    type : Number
  },
  website : {
    type : String
  },
  posted: {
    type: Date,
    default: Date.now
  },
  registryId : {
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
    default: Date.now
  },
  location: {
    type: String
  },
  type: {
    type: String
  },
  
  youfirstName: {
    type: String
  },
  yousecondName: {
    type: String
  },
  firstName : {
    type: String
  },
  secondName : {
    type: String
  },
  theme :{
    type: String
  },
  profileImageUrl : {
    type: String
  },
  visible : {
    type: Boolean,
    default: false
  },
  products : [{
    _id: { type: String }, 
    name: String, 
    slug: String,
    imageUrl : String,
    price : Number,
    desired: {
      type: Number,
      min: 1,
      default : 1
    },
    required: {
      type: Number,
      min: 0,
      default : 0
    },
    prodcode: {
      type: String
    },
    linkId : {
      type: String
    },
    affiliate : {
      type: Boolean,
      default: false
    },
    custom : {
      type: Boolean,
      default: false
    },
    multiple : {
      type: Boolean,
      default: false
    },
    description: {
     type: String 
   },
   paid: {
    type: Number,
    default: 0
  },
  feature : Array



}]

}, { versionKey: false }).index({
  'title': 'text'
});

RegistrySchema.plugin(slugs('title'));

module.exports = {
  registry: mongoose.model('Registry', RegistrySchema),
  rsvp: mongoose.model('Rsvp', RsvpSchema),
  guestBook : mongoose.model('GuestBook', GuestBookSchema),
  contribution: mongoose.model('Contribution', ContributionsSchema),
  accomodation: mongoose.model('Accomodation', AccomodationSchema),
  registrytype : mongoose.model('RegistryType',RegistryTypeSchema)
}
