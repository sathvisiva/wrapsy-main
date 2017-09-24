'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema

var homepageImageSchema = new Schema({
	imageUrl: String,
	text: String
});

var popularCategorySchema = new Schema({
	imageUrl: String,
	categories: {
		type: Schema.Types.ObjectId,
		ref: 'Catalog',
		index: true
	}
});

module.exports = {
  homepageImage: mongoose.model('HomePageImage', homepageImageSchema),
  popularCategory: mongoose.model('PopularCategory', popularCategorySchema)
}