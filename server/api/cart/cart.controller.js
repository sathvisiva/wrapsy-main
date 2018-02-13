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
 var Cart = require('./cart.model');
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

// Gets a list of Orders
export function index(req, res) {
  console.log("index cart")
  Cart.find()
  .populate('items.products')
  .execAsync()
  .then(responseWithResult(res))
  .catch(handleError(res));
}


// Gets a single Order from the DB
export function show(req, res) {
  console.log(req.params.id);
  Cart.findById(req.params.id).populate('items.products').populate('vouchers')
  .execAsync()
  .then(handleEntityNotFound(res))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Creates a new Order in the DB
export function create(req, res) {
  Cart.createAsync(req.body)
  .then(entity => {
    if (entity) {
      _.each(entity.items, function(i) {
        Product.findByIdAsync(i.productId)
        .then(function(product) {
          product.stock -= i.quantity;
          product.saveAsync();
        });
      })
      res.status(201).json(entity);
    }
  })
  .catch(handleError(res));
}

/*  export function addTocart(req,res){
    Cart.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
  }*/

  export function modifyCart(req,res){

    Cart.update( 
      { _id: req.params.id },
      { $pull: { items : { products : req.body.product } } },
      { safe: true },
      function(err, obj) {
        if(err){
          res.status(500).end();
        }
        Product.findByIdAsync(req.body.product)
        .then(function(product) {
          product.stock += parseInt(req.body.qty);
          product.saveAsync();
        });
        res.status(204).end();
      });


  }


  export function clearCart(req, res){



    Cart.findById(req.params.id)
    .execAsync()
    .then(function(cart){
      console.log(cart.items.length)
      var i = cart.items.length
      while (i--) {
        var task = cart.items[i]
          cart.items.remove(task); // or just task.remove()

        }
        cart.saveAsync()   
      })
    .then(() => {
      res.status(204).end();
    })
    .catch(handleError(res));
  }

// Updates an existing Order in the DB
/*export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Order.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(responseWithResult(res))
  .catch(handleError(res));
}*/

// Deletes a Order from the DB
export function destroy(req, res) {
  Cart.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}

export function alterpdtQuantity(req,res){

  console.log(req.body.product)
  Cart.find({_id : req.params.id , "items.products" : req.body.product},function(err,cart){
    var increment = {
      $set: {
        'items.$.quantity': parseInt(req.body.quantity),
        'items.$.subtotal': parseInt(req.body.subtotal)

      }
    };

    var query = {
      '_id': req.params.id,
      'items.products': req.body.product

    };

    Cart.update(query, increment, function(err,registry){
      res.status(204).end();
    });
  })
}

exports.addToCart = function(req,res){
  Cart.findById(req.params.id, function(err, cart){
    if(!cart){
      var cart = new Cart({ _id: req.params.id });
      cart.items = []
      cart.items.push(req.body);
      return cart.saveAsync()
      .then(() => {
        res.status(204).end();
      })

    }else{

      if(!cart.items){
        cart.items = []
        cart.items.push(req.body);
        return cart.saveAsync()
        .then(() => {
          res.status(204).end();
        })
        
      }else if(cart.items){

        for(var i =0 ; i < cart.items.length; i++){
          console.log(cart.items[i].products)
          console.log(req.body.products)
          console.log(req.body)
          if(cart.items[i].products == req.body.products){
            return handleError(res)('Product Already available in Cart')
          }
        }
        cart.items.push(req.body);
        return cart.saveAsync()
        .then(() => {
          res.status(204).end();
        })
      }


    }
  })



}

