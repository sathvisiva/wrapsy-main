'use strict';

angular.module('bhcmartApp')
.factory('Catalog', function($resource) {
  return $resource('/api/catalogs/:id/:controller', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    }
    ,
    'catalogCount': {
      method: 'post',
      isArray: true,
      params: {
        controller: 'catalogCount',
      }
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
  return $resource('/api/voucher/:id/:controller', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    },
    'redeem': {
      method: 'POST',
      params: {
        controller: 'redeem'
      }        
    }
  });
})
.factory('Home', function($resource) {
  return $resource('/api/home/:id/:controller', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    },
    'createhompageImg': {
      method: 'POST',
      params: {
        controller: 'hompageImg'
      }        
    },
    'GethompageImg': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'hompageImg'
      }        
    },
    'DelhompageImg': {
      method: 'DELETE',
      params: {
        controller: 'hompageImg'
      }        
    },
    'createpopularCat': {
      method: 'POST',
      params: {
        controller: 'popularCat'
      }        
    },
    'GetpopularCat': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'popularCat'
      }        
    },
    'DelpopularCat': {
      method: 'DELETE',
      params: {
        controller: 'popularCat'
      }        
    },
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
  return $resource('/api/products/:id/:controller/:limit/:page', {
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
    ,
    'features': {
      method: 'POST',
      params: {
        controller: 'features',
        limit: null
      }
    }
    ,
    'indexFeatures': {
      method: 'post',
      isArray: true,
      params: {
        controller: 'indexFeatures',
        limit: null
      }
    }
    ,
    'addfeaturedPdt': {
      method: 'post',
      isArray: true,
      params: {
        controller: 'addfeaturedPdt',
        limit: null
      }
    }
    ,
    'removefeaturedPdt': {
      method: 'post',
      isArray: true,
      params: {
        controller: 'removefeaturedPdt',
        limit: null
      }
    }
    ,'destroyFeature': {
      method: 'post',
      params: {
        controller: 'destroyFeature'
      }
    }
    ,
    'productCount': {
      method: 'post',
      isArray: true,
      params: {
        controller: 'productCount',
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
    'makevisible': {
      method: 'POST',
      params: {
        controller: 'makevisible',
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
    'accomodation': {
      method: 'POST',
      params: {
        controller: 'accomodation',
        limit: null
      }
    },
    'accomodationDetails': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'accomodation',
        limit: null
      }
    },
    'contribution': {
      method: 'POST',
      params: {
        controller: 'contribution',
        limit: null
      }
    },
    'contributionDetails': {
      method: 'GET',
      params: {
        controller: 'contribution',
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
}).service('stateService', function() {

  var states = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'cHattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Lakshadweep ', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
  var registry = {};
  var registrymethod = "";
/*
  var addregistry = function(newObj) {
    registry = newObj;
  }*/

  var getstates = function(){
    return states;
  }


  return {
    getstates: getstates
  };

});
