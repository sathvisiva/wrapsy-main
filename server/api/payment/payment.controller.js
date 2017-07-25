/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Vouchers              ->  index
 * POST    /api/Vouchers              ->  create
 * GET     /api/Vouchers/:id          ->  show
 * PUT     /api/Vouchers/:id          ->  update
 * DELETE  /api/Vouchers/:id          ->  destroy
 */

 'use strict';

 import _ from 'lodash';
 var Voucher = require('./payment.model');
 var sha512 = require('js-sha512');
 var cc = require('coupon-code');
 var Voucher = require('../voucher/voucher.model');
 var mail = require('../mail/sendmail');

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

export function createHash(req, res) {
  console.log("inside create hash");
  var salt = 'eCwWELxi';
  var hash = sha512(req.body.preHashString + salt);
  console.log(hash);
  res.send({success : true, hash: hash});
}

export function giftPaymentStatus(req, res) {
  
  Voucher.update({ _id: req.body.productinfo }, { $set: { paid: true }}, function (err, voucher) {
    if (err) {
      responseObject.err = err;
      responseObject.data = null;
      responseObject.code = 422;

      return res.json(responseObject);
    }

    Voucher.findById(req.body.productinfo, function (err, voucher) {

      if(err) { return handleError(res, err); }
      let voucherdetails = [
      {
        'email': voucher.email,
        'amount': voucher.amount,
        'vouchercode': voucher.code,
      }
      ];

      console.log(voucherdetails);
      mail.sendmail('voucher',voucherdetails);
      
    });

    

    res.redirect('/myvouchers');
  });

  
}


export function pdtPaymentStatus(req, res) {
  console.log(req.body);
  res.redirect('/shop');
}


// Gets a list of Vouchers
export function index(req, res) {
  Voucher.findAsync()
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Gets a single Voucher from the DB
export function show(req, res) {
  Voucher.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Creates a new Voucher in the DB
export function create(req, res) {


  req.body.code = cc.generate();;
  console.log(req.body);

  Voucher.createAsync(req.body)
  .then(responseWithResult(res, 201))
  .catch(handleError(res));
}

// Updates an existing Voucher in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Voucher.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Deletes a Voucher from the DB
export function destroy(req, res) {
  Voucher.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}
