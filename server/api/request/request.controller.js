'use strict';

import _ from 'lodash';
var Request = require('./request.model');
var fs = require('fs');
var filePath = '/client/assets/uploads/';
import path from 'path';
var Upload = require('../upload/upload.model');
var Order = require('../order/order.model');

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


export function deleteImage(req,res){
  console.log(req.body.url);
  var rootpath = path.normalize(__dirname + '/../../..')

  fs.exists( path.resolve( path.join(rootpath, 'client/') + req.body.url), function(exists) {
    if(exists) {
    //Show in green
    console.log('File exists. Deleting now ...');
    fs.unlink(path.resolve( path.join(rootpath, 'client/') + req.body.url));
  } else {

  }
});
  Upload.findOne({url : req.body.url})
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}
// Gets a list of Requests
export function index(req, res) {
  Request.find().populate('customerId').populate('orderId')
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Gets a list of user requests
export function myRequests(req, res) {
  Request.findAsync({ customerId: req.params.id })
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Gets a single Request from the DB
export function show(req, res) {
  Request.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Creates a new Request in the DB
export function create(req, res) {
  Request.createAsync(req.body)
  .then(request => {
    if (request) {
      Order.findById(request.orderId)
      .then(function(order) {
        if(request.cancel)
          order.cancelrequest = request._id
        order.status = 'Cancel Request Submitted'
        if (request.return) {
          console.log(request.return)
          _.each(order.items, function(i) {
            console.log("i" + i.products)
            console.log("req" + request.products)
            if(i.products == request.products.toString()){
              console.log("inside if")
              i.status = "Return Request Submitted";
              i.statusChangeHistory.push({'status' : "Return Request Submitted" })  
              i.returnrequest = request._id
            }
          })
        }
        console.log(order);
        order.saveAsync();
        res.status(201).json(order);
      });
    }
  })
  .catch(handleError(res));
}

// Updates an existing Request in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Request.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Deletes a Request from the DB
export function destroy(req, res) {
  Request.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}
