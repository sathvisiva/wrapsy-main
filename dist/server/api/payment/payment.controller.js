/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Vouchers              ->  index
 * POST    /api/Vouchers              ->  create
 * GET     /api/Vouchers/:id          ->  show
 * PUT     /api/Vouchers/:id          ->  update
 * DELETE  /api/Vouchers/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createHash = createHash;
exports.giftSuccessPaymentStatus = giftSuccessPaymentStatus;
exports.giftFilurePaymentStatus = giftFilurePaymentStatus;
exports.pdtPaymentStatus = pdtPaymentStatus;
exports.contributionStatus = contributionStatus;
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Payment = require('./payment.model');
var sha512 = require('js-sha512');
var cc = require('coupon-code');
var Voucher = require('../voucher/voucher.model');

var Order = require('../order/order.model');
var mail = require('../mail/sendmail');
var Registry = require('../registry/registry.model').registry;
var Contribution = require('../registry/registry.model').contribution;
var Registrycontroller = require('../registry/registry.controller');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
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

function updateVoucher(res, productinfo) {

  console.log(res);
  console.log(productinfo);
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

function createHash(req, res) {
  console.log("inside create hash");
  var salt = 'eCwWELxi';
  var hash = sha512(req.body.preHashString + salt);
  console.log(hash);
  res.send({ success: true, hash: hash });
}

function giftSuccessPaymentStatus(req, res) {

  Payment.create(req.body, function (err, payment) {
    if (err) {
      handleError(payment);
    }

    Voucher.update({ _id: req.body.productinfo }, { $set: { paid: true, paymentId: payment._id } }, function (err, voucher) {
      if (err) {
        handleError(err);
      }

      Voucher.findById(req.body.productinfo, function (err, voucher) {

        if (err) {
          return handleError(err);
        }
        var voucherdetails = [{
          'email': voucher.email,
          'amount': voucher.amount,
          'vouchercode': voucher.code
        }];

        console.log(voucherdetails);
        mail.sendmail('voucher', voucherdetails);
      });

      res.redirect('/myvouchers');
    });
  });
}

function giftFilurePaymentStatus(req, res) {

  console.log(req);
  console.log(req.body);

  Voucher.update({ _id: req.body.productinfo }, { $set: { paid: false } }, function (err, voucher) {
    if (err) {
      responseObject.err = err;
      responseObject.data = null;
      responseObject.code = 422;

      return res.json(responseObject);
    }

    res.redirect('/cart');
  });
}

function pdtPaymentStatus(req, res) {
  Order.update({ _id: req.body.productinfo }, { $set: { paid: true } }, function (err, voucher) {
    if (err) {
      responseObject.err = err;
      responseObject.data = null;
      responseObject.code = 422;

      return res.json(responseObject);
    }

    res.redirect('/orders');
  });
}

function contributionStatus(req, res) {
  console.log('payment success');
  console.log(req.body);
  console.log(JSON.stringify(req.body.productinfo));
  var str = JSON.stringify(req.body.productinfo);
  var productInfo = str.split(" ");
  var contribution = {};
  contribution.productId = productInfo[0].slice(1);
  contribution.contribution = productInfo[1];
  contribution.registryId = productInfo[2];
  contribution.name = productInfo[3];
  Contribution.create(contribution, function (err, registry) {
    if (err) {
      return handleError(res, err);
    }
  });

  console.log(contribution.contribution);
  console.log(contribution.registryId);
  console.log(contribution.productId);

  var increment = {
    $inc: {
      'products.$.paid': parseInt(contribution.contribution)
    }
  };
  var query = {
    '_id': contribution.registryId.toString(),
    'products._id': contribution.productId.toString()

  };

  Registry.update(query, increment, function (err, registry) {
    console.log(registry);
  });
}

// Gets a list of Vouchers

function index(req, res) {
  Voucher.findAsync().then(responseWithResult(res))['catch'](handleError(res));
}

// Gets a single Voucher from the DB

function show(req, res) {
  Voucher.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(responseWithResult(res))['catch'](handleError(res));
}

// Creates a new Voucher in the DB

function create(req, res) {

  req.body.code = cc.generate();;
  console.log(req.body);

  Voucher.createAsync(req.body).then(responseWithResult(res, 201))['catch'](handleError(res));
}

// Updates an existing Voucher in the DB

function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Voucher.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(responseWithResult(res))['catch'](handleError(res));
}

// Deletes a Voucher from the DB

function destroy(req, res) {
  Voucher.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
}
//# sourceMappingURL=payment.controller.js.map
