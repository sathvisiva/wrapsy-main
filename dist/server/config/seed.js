/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

//var users = require('../data/users.json');

var User = require('../api/user/user.model');
var Product = require('../api/product/product.model').product;

var Review = require('../api/product/product.model').review;
var Image = require('../api/product/product.model').image;
var Catalog = require('../api/catalog/catalog.model');
var Registry = require('../api/registry/registry.model').registry;
var catalogs = require('../data/catalogs.json');
var images = require('../data/images.json');
var reviews = require('../data/reviews.json');
var products = require('../data/products.json');
var registries = require('../data/registry.json');

/*var e = []
var d = []
for (var i = 10; i >= 0; i--) {
  var a = {
    _id: mongoose.Types.ObjectId(),
    title: "Test Review " + i + 1,
    content: "uild process packs ",
    by: users[Math.floor(Math.random() * 1)]._id,
    rating: 1 + Math.ceil(Math.random() * 4)
  }
  e.push(a)
  d.push(a._id)
};

console.log(e)
console.log(d)*/

/*User.find({}).removeAsync()
  .then(() => {
    _.each(users, function(user) {
      User.create(user);
    })
  })
  .then(() => {
    console.log('finished populating users');
  });*/

Catalog.find({}).removeAsync().then(function () {
  _lodash2['default'].each(catalogs, function (catalog) {
    Catalog.create(catalog);
  });
}).then(function () {
  console.log('finished populating catalogs');
});

Image.find({}).removeAsync().then(function () {
  _lodash2['default'].each(images, function (image) {
    Image.create(image);
  });
}).then(function () {
  console.log('finished populating images');
});

Review.find({}).removeAsync().then(function () {
  _lodash2['default'].each(reviews, function (review) {
    Review.create(review);
  });
}).then(function () {
  console.log('finished populating reviews');
});

Product.find({}).removeAsync().then(function () {
  _lodash2['default'].each(products, function (product) {
    Product.create(product);
  });
}).then(function () {
  console.log('finished populating products');
});
Registry.find({}).removeAsync().then(function () {
  _lodash2['default'].each(registries, function (registry) {
    Registry.create(registry);
  });
}).then(function () {
  console.log('finished populating registries');
});
//# sourceMappingURL=seed.js.map
