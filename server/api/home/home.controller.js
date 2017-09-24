/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Addresss              ->  index
 * POST    /api/Addresss              ->  create
 * GET     /api/Addresss/:id          ->  show
 * PUT     /api/Addresss/:id          ->  update
 * DELETE  /api/Addresss/:id          ->  destroy
 */

 'use strict';

 import _ from 'lodash';
 var HomePageImg = require('./home.model').homepageImage;
 var PopularCategory = require('./home.model').popularCategory;

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

// Gets a list of Addresss
export function indexHomePageImg(req, res) {

  HomePageImg.findAsync()
  .then(responseWithResult(res))
  .catch(handleError(res));
  
}

export function indexpopularCategory(req, res) {

  PopularCategory.findAsync()
  .then(responseWithResult(res))
  .catch(handleError(res));
  
}

// Gets a single Address from the DB
export function showHomePageImg(req, res) {
  HomePageImg.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

export function showPopularCategory(req, res) {
  PopularCategory.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(responseWithResult(res))
  .catch(handleError(res));
}

// Creates a new Address in the DB
export function createHomePageImg(req, res) {
  HomePageImg.createAsync(req.body)
  .then(responseWithResult(res, 201))
  .catch(handleError(res));
}

export function createPopularCategory(req, res) {
  PopularCategory.createAsync(req.body)
  .then(responseWithResult(res, 201))
  .catch(handleError(res));
}


// Deletes a Address from the DB
export function destroyHomePageImg(req, res) {
  HomePageImg.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}

export function destroyPopularCategory(req, res) {
  PopularCategory.findByIdAsync(req.params.id)
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}