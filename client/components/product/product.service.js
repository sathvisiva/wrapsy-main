'use strict';

angular.module('bhcmartApp')
.factory('Catalog', function($resource) {
  return $resource('/api/catalogs/:id', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    }
  });
})
.factory('Address', function($resource) {
  return $resource('/api/address/:id', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    }
  });
})
.factory('Voucher', function($resource) {
  return $resource('/api/voucher/:id', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    },
    'redeem': {
      method: 'POST',
      params: {
        controller: 'redeem',
        limit: null
      }        
    }
  });
})
.factory('Payment', function($resource) {
  return $resource('/api/payment/:id/:controller', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    },
    'createHash': {
      method: 'POST',
      params: {
        controller: 'createHash',
        limit: null
      }        
    },
    'PaymentStatus': {
      method: 'POST',
      params: {
        controller: 'PaymentStatus',
        limit: null
      }        
    },
  });
}).factory('Product', function($resource) {
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
        controller: 'search',
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
}).factory('Registry', function($resource) {
  return $resource('/api/registry/:id/:controller/:limit', {
    id: '@_id'
  }, {
    'update': { method: 'PUT' },
    'search': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'search',
      }
    },
    'registryGuest': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'registryGuest',
      }
    },
    'registryGuestBook': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'registryGuestBook',
      }
    },
    'registryProduct': {
      method: 'POST',
      params: {
        controller: 'registryProduct',
        limit: null
      }
    },
    'getregistryProduct': {
      method: 'POST',
      params: {
        controller: 'getregistryProduct',
        limit: null
      }
    },
    'rsvpRegistry': {
      method: 'POST',
      params: {
        controller: 'rsvpRegistry',
        limit: null
      }
    },
    'guestBookRegistry': {
      method: 'POST',
      params: {
        controller: 'guestBookRegistry',
        limit: null
      }
    },
    'updatePdtcnt': {
      method: 'POST',
      params: {
        controller: 'updatePdtcnt',
        limit: null
      }
    }
  });
}).service('RegistryService', function() {
  var registry = {};
  var registrymethod = "";

  var addregistry = function(newObj) {
    registry = newObj;
  }

  var getregistry = function(){
    return registry;
  }

  var addregistryMethod = function(newObj) {
    registrymethod = newObj;
  }

  var getregistryMethod = function(){
    return registrymethod;
  }

  return {
    addregistry: addregistry,
    getregistry: getregistry,
    addregistryMethod : addregistryMethod,
    getregistryMethod : getregistryMethod
  };

});