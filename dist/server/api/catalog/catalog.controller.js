/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/catalogs              ->  index
 * POST    /api/catalogs              ->  create
 * GET     /api/catalogs/:id          ->  show
 * PUT     /api/catalogs/:id          ->  update
 * DELETE  /api/catalogs/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Catalog = require('./catalog.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function isJson(str) {
  try {
    str = JSON.parse(str);
  } catch (e) {
    str = str;
  }
  return str;
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
    var updated = _.merge(entity, updates);
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

exports.count = function (req, res) {

  if (req.query) {
    var q = isJson(req.query.where);
    Catalog.find(q).count().exec(function (err, count) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }
      return res.status(200).json([{ count: count }]);
    });
  } else {
    Catalog.count().exec(function (err, count) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }
      return res.status(200).json([{ count: count }]);
    });
  }
};

// Gets a list of Catalogs
exports.index = function (req, res) {

  if (req.query) {
    var q = isJson(req.query.where);
    console.log(q);
    Catalog.find(q).sort({ parent: 1 }).execAsync().then(responseWithResult(res))['catch'](handleError(res));
  } else {
    Catalog.find().sort({ parent: 1 }).populate('parent').execAsync().then(responseWithResult(res))['catch'](handleError(res));
  }
};

// Gets a single Catalog from the DB
exports.show = function (req, res) {
  Catalog.findOne({
    slug: req.params.slug
  }).execAsync().then(handleEntityNotFound(res)).then(responseWithResult(res))['catch'](handleError(res));
};

// Creates a new Catalog in the DB
exports.create = function (req, res) {
  Catalog.findByIdAsync(req.body.parent).then(function (parent) {
    console.log(parent);
    if (parent) {
      delete req.body.parent;
      return parent.addChild(req.body);
    }
    return Catalog.createAsync(req.body);
  }).then(responseWithResult(res))['catch'](handleError(res));
};

// Updates an existing Catalog in the DB
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Catalog.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(responseWithResult(res))['catch'](handleError(res));
};

// Deletes a Catalog from the DB
exports.destroy = function (req, res) {
  Catalog.findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
};
//# sourceMappingURL=catalog.controller.js.map
