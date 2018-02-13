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
 var Registrycontroller = require('../registry/registry.controller');
 var Voucher = require('../voucher/voucher.model')
 var Cart = require('../cart/cart.model')


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

exports.count = function(req, res) {

 


  Order.count().exec(function (err, count) {
    if(err) { 
      console.log(err)
      return handleError(res, err); }
      return res.status(200).json([{count:count}]);
    });
  
};

// Gets a list of Orders
export function index(req, res) {
  Order.find().populate('items.products').execAsync()
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Gets a list of user Orders
export function myOrders(req, res) {
  Order.find({ customerId: req.params.id }).populate('items.products').populate('address').populate('vouchers')
  .execAsync()
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

export function updateStatus(req,res){
  console.log(req.body.product)
  Order.findOne({'orderNumber' :req.body.id , 'items.products' : req.body.product }).execAsync()
  .then(function(order){
    _.each(order.items , function(i){

     if(i.products == req.body.product){
      i.status = req.body.status;
      i.statusChangeHistory.push({'status' : req.body.status })    
    }
  })
    order.saveAsync()
    
    res.status(201).json(order);
  })
  .catch(handleError(res));


} 




// Creates a new Order in the DB
export function create(req, res) {
  Order.createAsync(req.body)
  .then(entity => {
    console.log(entity)
    if (entity) {
      if(entity.vouchers){
        console.log('Vouchers' + entity.vouchers)
        Voucher.findByIdAsync(entity.vouchers)
        .then(function(voucher){
          voucher.redeemed = true;
          voucher.saveAsync();
        })
      }
      _.each(entity.items, function(i) {
        Product.findByIdAsync(i.products)
        .then(function(product) {
          product.stock -= i.quantity;
          product.saveAsync();
        });

        if(i.registry){
          Registrycontroller.updateRegistryProduct(i.registry,i.products,i.quantity)
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

// Deletes a Order from the DB
export function destroy(req, res) {
  Order.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}
