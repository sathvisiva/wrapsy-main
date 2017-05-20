/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  update
 * DELETE  /api/orders/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;
exports.myOrders = myOrders;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Order = require('./order.model');
var Product = require('../product/product.model').product;
var Registry = require('../registry/registry.model').registry;
var Registrycontroller = require('../registry/registry.controller');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
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
    var updated = _lodash2['default'].merge(entity, updates);
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

// Gets a list of Orders

function index(req, res) {
  Order.findAsync().then(responseWithResult(res))['catch'](handleError(res));
}

// Gets a list of user Orders

function myOrders(req, res) {
  Order.findAsync({ customerId: req.params.id }).then(responseWithResult(res))['catch'](handleError(res));
}

// Gets a single Order from the DB

function show(req, res) {
  Order.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(responseWithResult(res))['catch'](handleError(res));
}

// Creates a new Order in the DB

function create(req, res) {

  Order.createAsync(req.body).then(function (entity) {
    if (entity) {
      _lodash2['default'].each(entity.items, function (i) {
        Product.findByIdAsync(i.productId).then(function (product) {
          product.stock -= i.quantity;
          product.saveAsync();
        });
        if (i.registry) {

          Registrycontroller.updateRegistryProduct(i.registry, i.productId, i.quantity);
        }
      });
      res.status(201).json(entity);
    }
  })['catch'](handleError(res));
}

// Updates an existing Order in the DB

function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Order.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(responseWithResult(res))['catch'](handleError(res));
}

// Deletes a Order from the DB

function destroy(req, res) {
  Order.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
}
//# sourceMappingURL=order.controller.js.map