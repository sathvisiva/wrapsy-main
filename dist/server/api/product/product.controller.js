/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _ = require('lodash');

var Product = require('./product.model').product;
var Image = require('./product.model').image;
var Review = require('./product.model').review;
var Feature = require('./product.model').feature;
var Filter = require('./product.model').filter;
var Catalog = require('../catalog/catalog.model');
var path = require('path');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.error(err, statusCode);
    res.status(statusCode).send(err);
  };
}

function isJson(str) {
  try {
    str = JSON.parse(str);
  } catch (e) {
    str = str;
  }
  return str;
}

function responseWithResult(res, statusCode) {

  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync().spread(function (updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.removeAsync().then(function () {
        res.status(204).end();
      });
    }
  };
}

function saveFeaturedImage(res, file) {
  return function (entity) {
    var newPath = '/assets/uploads/' + path.basename(file.path);
    entity.imageUrl = newPath;
    return entity.saveAsync().spread(function (updated) {
      return updated;
    });
  };
}

function productsInCategory(limit, page) {
  limit = Number(limit) || null;
  return function (catalog) {
    var catalog_ids = [catalog._id].concat(catalog.children);
    console.log(catalog_ids);
    return Product.find({
      'categories': {
        $in: catalog_ids
      }
    }).skip(page * limit).limit(limit).sort({ title: 'asc' }).populate({ path: 'categories', select: 'name' }).populate({ path: 'reviews', select: 'rating' }).populate({ path: 'images', select: 'imageUrl' }).populate({ path: 'feature ', select: 'name' }).execAsync();
  };
}

function productsInSearchCategory(term) {
  return function (catalog) {
    var catalog_ids = [catalog._id].concat(catalog.children);
    var option;

    if (catalog.slug == 'all') option = {
      $text: {
        $search: term
      }
    };else option = {
      'categories': {
        $in: catalog_ids
      },
      $text: {
        $search: term
      }
    };

    return Product.find(option).populate({ path: 'categories', select: 'name' }).populate({ path: 'reviews', select: 'rating' }).populate({ path: 'images', select: 'imageUrl' }).execAsync();
  };
}

// Gets a list of Products
exports.index = function (req, res) {
  if (req.query) {
    var q = isJson(req.query.where);
    var limit = parseInt(req.query.list);
    var skip = parseInt(req.query.skip);

    console.log(limit);
    Product.find(q).limit(limit).skip(skip).populate({ path: "categories", select: "name" }).execAsync().then(responseWithResult(res))['catch'](handleError(res));
  } else {
    Product.find().sort({ featured: 1 }).populate({ path: "categories", select: "name" }).execAsync().then(responseWithResult(res))['catch'](handleError(res));
  }
};

exports.catalogindex = function (req, res) {
  if (req.query) {
    console.log(req.query);
    var q = isJson(req.query.where);
    Product.find(q).limit(req.query.limit).skip(req.query.skip).populate({ path: "categories", select: "name" }).execAsync().then(responseWithResult(res))['catch'](handleError(res));
  }
};

exports.addtofeaturedproducts = function (req, res) {
  Product.update({ _id: req.params.id }, { $set: { featured: true } }, function (err, product) {
    if (err) {
      responseObject.err = err;
      responseObject.data = null;
      responseObject.code = 422;

      return res.json(responseObject);
    }
    Product.find().sort({ featured: 1 }).populate({ path: "categories", select: "name" }).execAsync().then(responseWithResult(res))['catch'](handleError(res));
  });
};

exports.removefromfeaturedproducts = function (req, res) {
  Product.update({ _id: req.params.id }, { $set: { featured: false } }, function (err, product) {
    if (err) {
      responseObject.err = err;
      responseObject.data = null;
      responseObject.code = 422;

      return res.json(responseObject);
    }
    Product.find().sort({ featured: 1 }).populate({ path: "categories", select: "name" }).execAsync().then(responseWithResult(res))['catch'](handleError(res));
  });
};

exports.indexAffiliateProduct = function (req, res) {
  Product.find({ affiliate: true }).sort({ stock: 1 }).populate({ path: "categories", select: "name" }).execAsync().then(responseWithResult(res))['catch'](handleError(res));
};

exports.indexFeatures = function (req, res) {
  Feature.find().execAsync().then(responseWithResult(res))['catch'](handleError(res));
};

exports.indexFilters = function (req, res) {
  Filter.find().execAsync().then(responseWithResult(res))['catch'](handleError(res));
};

exports.count = function (req, res) {

  console.log(req.body);

  if (req.body) {

    var q = isJson(req.body.where);
    console.log("q" + q);

    Product.find(q).count().exec(function (err, count) {
      console.log("count" + count);
      if (err) {
        console.log(err);
        return handleError(res, err);
      }
      return res.status(200).json([{ count: count }]);
    });
  } else {
    Product.count().exec(function (err, count) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }
      return res.status(200).json([{ count: count }]);
    });
  }
};
// Gets a single Product from the DB
exports.show = function (req, res) {
  Product.findOne({
    slug: req.params.slug
  }).populate('images').populate({ path: 'reviews' }).populate({ path: 'categories', select: 'slug' }).execAsync().then(handleEntityNotFound(res)).then(function (entity) {
    if (entity) {
      res.status(200).json(entity);
    }
  })['catch'](handleError(res));
};

// Creates a new Product in the DB
exports.create = function (req, res) {
  Product.createAsync(req.body).then(responseWithResult(res, 201))['catch'](handleError(res));
};

exports.createFeature = function (req, res) {
  console.log("inside create feature");
  console.log(req.body);
  Feature.createAsync(req.body).then(responseWithResult(res, 201))['catch'](handleError(res));
};

exports.createFilter = function (req, res) {
  console.log("inside create createFilter");
  console.log(req.body);
  Filter.createAsync(req.body).then(responseWithResult(res, 201))['catch'](handleError(res));
};

// Updates an existing Product in the DB
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Product.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(responseWithResult(res))['catch'](handleError(res));
};

exports.updateFeature = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Feature.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(responseWithResult(res))['catch'](handleError(res));
};

// Deletes a Product from the DB
exports.destroy = function (req, res) {
  Product.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
};

exports.destroyFeature = function (req, res) {
  Feature.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
};

exports.destroyFilter = function (req, res) {
  Filter.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
};

// Uploads a new Product's featured image in the DB
exports.upload = function (req, res) {
  var file = req.files.file;
  if (!file) {
    return handleError(res)('File not provided');
  }

  Product.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(saveFeaturedImage(res, file)).then(responseWithResult(res))['catch'](handleError(res));
};

exports.catalog = function (req, res) {
  console.log("inside catalog");
  console.log(req.body);
  var limit = req.params.limit;
  var page = req.params.page || 0;
  Catalog.findOne({
    slug: req.params.slug
  }).execAsync().then(productsInCategory(limit, page)).then(responseWithResult(res))['catch'](handleError(res));
};

exports.search = function (req, res) {
  var term = req.params.term;
  Catalog.findOne({
    slug: req.params.slug
  }).execAsync().then(productsInSearchCategory(term)).then(responseWithResult(res))['catch'](handleError(res));
};

/*images*/
function linkImageProduct(req, res, productId) {
  return function (entity) {
    var image = entity;
    return Product.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(function (entity) {
      entity.images.push(image._id);
      return entity.saveAsync().spread(function () {
        return image;
      });
    });
  };
}

function getImages(res) {
  return function (entity) {
    if (entity) {
      var images = _.map(entity.images, function (imageId) {
        return Image.findByIdAsync(imageId).then(handleEntityNotFound(res));
      });
      return _Promise.all(images);
    } else {
      return null;
    }
  };
}

function saveImageUpdates(file) {
  return function (entity) {
    var newPath = '/assets/uploads/' + path.basename(file.path);
    var updated = _.merge(entity, {
      imageUrl: newPath
    });

    return updated.saveAsync().spread(function (updated) {
      return updated;
    });
  };
}

// Uploads a new Product's other images image in the DB
exports.uploadImage = function (req, res) {
  var file = req.files.file;
  if (!file) {
    return handleError(res)('File not provided');
  }

  var newPath = '/assets/uploads/' + path.basename(file.path);

  Image.createAsync({
    imageUrl: newPath
  }).then(linkImageProduct(req, res, req.params.id)).then(responseWithResult(res, 201))['catch'](handleError(res));
};

// Gets images for a single Product from the DB
exports.indexImage = function (req, res) {
  Product.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(getImages(res)).then(responseWithResult(res))['catch'](handleError(res));
};

// Updates an existing Product image in the DB
exports.updateImage = function (req, res) {
  var file = req.files.file;
  if (!file) {
    return handleError(res)('File not provided');
  }

  Image.findByIdAsync(req.params.image_id).then(handleEntityNotFound(res)).then(saveImageUpdates(file)).then(responseWithResult(res))['catch'](handleError(res));
};

/*Variants*/
/*function getVariants(res) {
  return function(entity) {
    if (entity) {
      var variants = _.map(entity.variants, function(variantId) {
        return Variant.findByIdAsync(variantId)
        .then(handleEntityNotFound(res));
      })
      return Promise.all(variants);
    } else {
      return null;
    }
  }
}

function linkVariantProduct(res, productId) {
  return function(entity) {
    var variant = entity;
    return Product.findByIdAsync(productId)
    .then(handleEntityNotFound(res))
    .then(function(entity) {
      entity.variants.push(variant._id);
      return entity.saveAsync().spread(function() {
        return variant;
      });
    })
  }
}

function removeVariantId(variantId, variant) {
  return function(entity) {
    var variantIndex = entity.variants.indexOf(variantId);
    entity.variants.splice(variantIndex, 1);
    return entity.saveAsync()
    .then(function() {
      return variant;
    });
  };
}

exports.createVariant = function(req, res) {
  Variant.createAsync(req.body)
  .then(linkVariantProduct(res, req.params.id))
  .then(responseWithResult(res, 201))
  .catch(handleError(res));
}

// Gets variants for a single Product from the DB
exports.indexVariant = function(req, res) {
  Product.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(getVariants(res))
  .then(responseWithResult(res))
  .catch(handleError(res));
};
// Updates an existing Variant in the DB
exports.updateVariant = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Variant.findByIdAsync(req.params.variant_id)
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(responseWithResult(res))
  .catch(handleError(res));
};

// Deletes a variant from the DB
exports.destroyVariant = function(req, res) {

  Variant.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(function(entity) {
    var variant = entity;
    return Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeVariantId(req.params.variant_id, variant));
  })
  .then(removeEntity(res))
  .catch(handleError(res));
};*/

/*Reviews*/
function getReviews(res) {
  return function (entity) {
    if (entity) {
      var reviews = _.map(entity.reviews, function (reviewId) {
        return Review.findByIdAsync(reviewId).then(handleEntityNotFound(res));
      });
      return _Promise.all(reviews);
    } else {
      return null;
    }
  };
}

function linkReviewProduct(res, productId) {
  return function (entity) {
    var review = entity;
    return Product.findByIdAsync(productId).then(handleEntityNotFound(res)).then(function (entity) {
      entity.reviews.push(review._id);
      return entity.saveAsync().spread(function () {
        return review;
      });
    });
  };
}

function removeReviewId(reviewId, review) {
  return function (entity) {
    var reviewIndex = entity.reviews.indexOf(reviewId);
    entity.reviews.splice(reviewIndex, 1);
    return entity.saveAsync().then(function () {
      return review;
    });
  };
}

exports.createReview = function (req, res) {
  Review.createAsync(req.body).then(linkReviewProduct(res, req.params.id)).then(responseWithResult(res, 201))['catch'](handleError(res));
};

// Gets reviews for a single Product from the DB
exports.indexReview = function (req, res) {
  Product.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(getReviews(res)).then(responseWithResult(res))['catch'](handleError(res));
};
// Updates an existing Variant in the DB
exports.updateReview = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Review.findByIdAsync(req.params.review_id).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(responseWithResult(res))['catch'](handleError(res));
};

// Deletes a variant from the DB
exports.destroyReview = function (req, res) {

  Review.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(function (entity) {
    var review = entity;
    return Product.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeReviewId(req.params.review_id, review));
  }).then(removeEntity(res))['catch'](handleError(res));
};
//# sourceMappingURL=product.controller.js.map
