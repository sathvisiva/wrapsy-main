/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

 'use strict';

 import _ from 'lodash';
 var Vendor = require('./vendor.model');
 var Registry = require('../registry/registry.controller');
 //var Product = require('../product/product.controller');
 var Order = require('../order/order.controller');
 var Product = require('../product/product.model').product;

 function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
    .spread(updated => {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
      .then(() => {
        res.status(204).end();
      });
    }
  };
}

// Gets a list of Things
export function index(req, res) {
  Vendor.findAsync()
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  Vendor.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Creates a new Thing in the DB
export function create(req, res) {
  Vendor.createAsync(req.body)
  .then(responseWithResult(res, 201))
  .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Vendor.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  Vendor.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
 /* console.log("inside destroy");
  console.log(req.params.id)
  Product.productsInVendor(req.params.id, function(err , product){
    console.log(err);
    console.log(product)
  })
  

  Product.find({vendor:req}).exec(function (err, product) {
    if(err) { console.log(err);
      return handleError(res, err); }
      res.send(product);
    });
  
  var product = Product.productsInVendor(req.params.id)
  console.log(product)
  console.log(Product.productsInVendor(req.params.id))
  Vendor.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));*/
}
