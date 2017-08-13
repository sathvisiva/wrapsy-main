/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  update
 * DELETE  /api/orders/:id          ->  destroy
 */

 'use strict';

 import _ from 'lodash';
 var Order = require('./order.model');
 var Product = require('../product/product.model').product;
 var Registry = require('../registry/registry.model').registry;
 var Registrycontroller = require('../registry/registry.controller');

 function isJson(str) {
  try {
    str = JSON.parse(str);
  } catch (e) {
    str = str;
  }
  return str
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err)
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

    var updated = entity;
    updated.delivered = true
    return updated.saveAsync()
    .spread(updated => {
      return updated;
    });
  };
}

function saveCancelUpdates(updates) {
  return function(entity) {

    var updated = entity;
    updated.cancel = true
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

// Gets a list of Orders
export function index(req, res) {
  Order.findAsync()
  .then(responseWithResult(res))
  .catch(handleError(res));

  
}

// Gets a list of user Orders
export function myOrders(req, res) {
  console.log(req.params.id)
  Order.findAsync({ customerId: req.params.id })
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Gets a single Order from the DB
export function show(req, res) {
  Order.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

exports.countorders = function(req, res) {
  /*Order.find().count()
  .then(responseWithResult(res))
  .catch(handleError(res));*/
  
    
  if(req.body){
    
    
    var q = isJson(req.query.where);
    Order.find(q).exec(function (err, count) {
      if(err) { 
        console.log(err)
        return handleError(res, err); }
          console.log(count);
        return res.status(200).json([{count:count}]);
      });
  }else{
    Order.find().count().exec(function (err, count) {
      if(err) { 
        console.log(err)
        return handleError(res, err); }
        return res.status(200).json([{count:count}]);
      });
  }
};

// Creates a new Order in the DB
export function create(req, res) {
  console.log(req.body)
  
  Order.createAsync(req.body)
  .then(entity => {
    if (entity) {
      _.each(entity.items, function(i) {
        Product.findByIdAsync(i.productId)
        .then(function(product) {
          product.stock -= i.quantity;
          product.saveAsync();
        });
        if(i.registry){
          Registrycontroller.updateRegistryProduct(i.registry,i.productId,i.quantity, req.body.customerEmail, req.body.customerName)
        }
      })
      res.status(201).json(entity);
    }
  })
  .catch(handleError(res));
}

// Updates an existing Order in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Order.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

export function updateCancel(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Order.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(saveCancelUpdates(req.body))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Deletes a Order from the DB
export function destroy(req, res) {
  Order.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}


