'use strict';

import mongoose from 'mongoose';
var slugs = require('mongoose-url-slugs');

var Schema = mongoose.Schema;

/**
 * Todo Schema
 */
 var BlogSchema = new Schema({
   title: String,
   content: String,
   author: String,
   createdAt : {
    type: Date, 
    default: Date.now
  }
});

 var CommentSchema = new Schema({
  name: String,
  email: String,
  comment : String,
  post: { type: Schema.Types.ObjectId, ref: 'Blog' },
  createdAt : {
    type: Date, 
    default: Date.now
  }
});


 BlogSchema.plugin(slugs('title'));

// keep track of when todos are updated and created
/*PostSchema.pre('save', function(next, done) {
	if (this.isNew) {
		this.createdAt = Date.now();
	}
	this.updatedAt = Date.now();
	next();
});*/

module.exports = {
  posts: mongoose.model('Blog', BlogSchema),
  comments: mongoose.model('Comments', CommentSchema)
}
