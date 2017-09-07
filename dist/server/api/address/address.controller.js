/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Addresss              ->  index
 * POST    /api/Addresss              ->  create
 * GET     /api/Addresss/:id          ->  show
 * PUT     /api/Addresss/:id          ->  update
 * DELETE  /api/Addresss/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Address = require('./address.model');

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

// Gets a list of Addresss

function index(req, res) {
  if (req.query) {
    var q = isJson(req.query.where);
    Address.findOne(q).then(responseWithResult(res))['catch'](handleError(res));
  } else {
    Address.findAsync().then(responseWithResult(res))['catch'](handleError(res));
  }
}

// Gets a single Address from the DB

function show(req, res) {
  Address.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(responseWithResult(res))['catch'](handleError(res));
}

// Creates a new Address in the DB

function create(req, res) {
  Address.createAsync(req.body).then(responseWithResult(res, 201))['catch'](handleError(res));
}

// Updates an existing Address in the DB

function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Address.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(responseWithResult(res))['catch'](handleError(res));
}

// Deletes a Address from the DB

function destroy(req, res) {
  Address.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
}
//# sourceMappingURL=address.controller.js.map
