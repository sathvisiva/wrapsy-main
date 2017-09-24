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
exports.index = index;
exports.show = show;
exports.create = create;
exports.checkredeem = checkredeem;
exports.redeem = redeem;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Voucher = require('./voucher.model');
var cc = require('coupon-code');

function isJson(str) {
  try {
    str = JSON.parse(str);
  } catch (e) {
    str = str;
  }
  return str;
}

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

// Gets a list of Vouchers

function index(req, res) {
  if (req.query) {
    var q = isJson(req.query.where);
    Voucher.findAsync(q).then(responseWithResult(res))['catch'](handleError(res));
  } else {
    Voucher.findAsync().then(responseWithResult(res))['catch'](handleError(res));
  }
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

function checkredeem(req, res) {}

function redeem(req, res) {
  console.log(req.body);
  var code = req.body.code;

  Voucher.findOne({ 'code': code }, function (err, voucher) {

    if (voucher) {
      var todayDate = new Date();
      var validDatae = new Date(voucher.validuntil);
      console.log(voucher.amount);
      if (voucher.redeemed) {
        return res.json({ 'errorcode': 0 });
      } else if (new Date().getTime() > new Date(voucher.validuntil).getTime()) {
        return res.json({ 'errorcode': 1 });
      } else if (parseInt(voucher.amount) > parseInt(req.body.amount)) {
        return res.json({ 'errorcode': 2 });
      } else {
        Voucher.update({ 'code': code }, { $set: { redeemed: true } }, function (err, resp) {
          if (err) {
            resp.err = err;
            resp.data = null;
            resp.code = 422;

            return res.json(responseObject);
          }
          console.log(voucher);
          return res.json(voucher);
        });
      }
    } else {
      return res.json({ 'errorcode': 3 });
    }
  });
  /**/
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
//# sourceMappingURL=voucher.controller.js.map
