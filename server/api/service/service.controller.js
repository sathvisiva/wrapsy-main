/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Courses              ->  index
 * POST    /api/Courses              ->  create
 * GET     /api/Courses/:id          ->  show
 * PUT     /api/Courses/:id          ->  update
 * DELETE  /api/Courses/:id          ->  destroy
 */

 'use strict';

 import _ from 'lodash';
 var Service = require('./service.model').service;
 var ServiceVendor = require('./service.model').serviceVendor;

 function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
    .then(updated => {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
      .then(() => {
        res.status(204).end();
      });
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


export function query(req, res) {
 
 Service.find().exec(function(err, service) {
  if (err) return res.json(500, err);
  res.json(service);
});
}

export function queryVendors(req, res) {
 
 ServiceVendor.find().exec(function(err, service) {
  if (err) return res.json(500, err);
  res.json(service);
});
}


export function getVendorsByService(req, res){
 if(req.query.slug){
  
  var q = isJson(req.query.where);
  
  ServiceVendor.findOne(req.query).sort('-createdAt').exec(function(err, serviceVendor) {
    if (err) return res.json(500, err);
    res.json(serviceVendor);
  });
}
else{
  ServiceVendor.find({service : req.params.id}).sort('-createdAt').exec(function(err, serviceVendor) {
    if (err) return res.json(500, err);
    res.json(serviceVendor);
  });
} 


}


export function show(req, res) {

  return Service.findOne({slug : req.params.id }).exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));

}

export function showServiceVendor(req, res) {

  return ServiceVendor.findOne({slug : req.params.id }).exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));

}


export function create(req, res) {
 console.log(req.body)
 Service.create(req.body, function(err, blog) {
  if(err) { return handleError(res, err); }
  return res.status(201).json(blog);
});
}


export function createServiceVendor(req, res) {
 ServiceVendor.create(req.body, function(err, blog) {
  if(err) { return handleError(res, err); }
  return res.status(201).json(blog);
});
}

// Updates an existing Course in the DB
export function update(req, res) {
  
  if (req.body._id) {
    delete req.body._id;
  }
  return Service.findById(req.params.id).exec()
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

export function updateServiceVendor(req, res) {
  
  if (req.body._id) {
    delete req.body._id;
  }
  return ServiceVendor.findById(req.params.id).exec()
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Remove a Course
export function remove(req, res) {
 return Service.findById(req.params.id).exec()
 .then(handleEntityNotFound(res))
 .then(removeEntity(res))
 .catch(handleError(res));
}

export function removeSeriveVendor(req, res) {
 return ServiceVendor.findById(req.params.id).exec()
 .then(handleEntityNotFound(res))
 .then(removeEntity(res))
 .catch(handleError(res));
}
