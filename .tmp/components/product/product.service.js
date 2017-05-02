'use strict';

angular.module('bhcmartApp').factory('Catalog', function ($resource) {
  return $resource('/api/catalogs/:id', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    }
  });
}).factory('Product', function ($resource) {
  return $resource('/api/products/:id/:controller/:limit', {
    id: '@_id'
  }, {
    'update': { method: 'PUT' },
    'catalog': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'catalog'
      }
    },
    'search': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'search'
      }
    },
    'review': {
      method: 'POST',
      params: {
        controller: 'reviews',
        limit: null
      }
    }
  });
}).factory('Registry', function ($resource) {
  return $resource('/api/registry/:id/:controller/:limit', {
    id: '@_id'
  }, {
    'update': { method: 'PUT' },
    'search': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'search'
      }
    },
    'registryProduct': {
      method: 'POST',
      params: {
        controller: 'registryProduct',
        limit: null
      }
    },
    'rsvpRegistry': {
      method: 'POST',
      params: {
        controller: 'rsvpRegistry',
        limit: null
      }
    }
  });
}).service('RegistryService', function () {
  var registry = {};

  var addregistry = function addregistry(newObj) {
    registry = newObj;
  };

  var getregistry = function getregistry() {
    return registry;
  };

  return {
    addregistry: addregistry,
    getregistry: getregistry
  };
});
//# sourceMappingURL=product.service.js.map
