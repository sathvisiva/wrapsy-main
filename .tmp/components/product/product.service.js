'use strict';

angular.module('bhcmartApp').factory('Catalog', function ($resource) {
  return $resource('/api/catalogs/:id', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    }
  });
}).factory('Vendor', function ($resource) {
  return $resource('/api/vendors/:id', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    }
  });
}).factory('Service', function ($resource) {
  return $resource('api/services/:id/:controller', {
    id: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    'createvendor': {
      method: 'POST',
      params: {
        controller: 'vendor',
        limit: null
      }
    },
    'updatevendor': {
      method: 'PUT',
      params: {
        controller: 'vendor',
        limit: null
      }
    },
    'vendor': {
      method: 'DELETE',
      params: {
        controller: 'vendor',
        limit: null
      }
    },
    'getVendors': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'vendors',
        limit: null
      }
    },
    'getServiceVendors': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'vendorsinservice',
        limit: null
      }
    },
    'getvendor': {
      method: 'GET',
      params: {
        controller: 'vendor',
        limit: null
      }
    }
  });
}).factory('Voucher', function ($resource) {
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
}).factory('UploadImage', function ($resource) {
  return $resource('/api/uploads/:id/:controller', {
    id: '@_id'
  }, {
    'des': {
      method: 'POST',
      params: {
        controller: 'des'
      }
    }
  });
}).factory('Blog', function ($resource) {
  return $resource('api/blog/:id/:controller', {
    id: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    'comment': {
      method: 'POST',
      params: {
        controller: 'comment',
        limit: null
      }
    },
    'comments': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'comments',
        limit: null
      }
    }
  });
}).factory('Home', function ($resource) {
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
    'gethompageImg': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'hompageImg'
      }
    },
    'delhompageImg': {
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
    'getpopularCat': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'popularCat'
      }
    },
    'delpopImg': {
      method: 'DELETE',
      params: {
        controller: 'popularCat'
      }
    }
  });
}).factory('Payment', function ($resource) {
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
    'registryGuest': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'registryGuest'
      }
    },
    'registryGuestBook': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'registryGuestBook'
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
    'updatetheme': {
      method: 'POST',
      params: {
        controller: 'updatetheme',
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
    'updateProfilepic': {
      method: 'PUT',
      params: {
        controller: 'updateProfilepic',
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
}).factory('Feature', function ($resource) {
  return $resource('/api/features/:id/:controller', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    },
    'group': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'group',
        limit: null
      }
    }
  });
}).factory('Filter', function ($resource) {
  return $resource('/api/filters/:id/:controller', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    },

    'group': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'group',
        limit: null
      }
    }
  });
}).factory('Cart', function ($resource) {
  return $resource('/api/cart/:id/:controller', {
    id: '@_id'
  }, {
    'update': {
      method: 'PUT'
    },
    'alterpdtQuantity': {
      method: 'PUT',
      params: {
        controller: 'alterpdtQuantity'
      }
    },
    'modifyCart': {
      method: 'PUT',
      params: {
        controller: 'modifyCart'
      }
    },
    'clearCart': {
      method: 'PUT',
      params: {
        controller: 'clearCart'
      }
    },
    'show': {
      method: 'GET',
      isArray: false,
      params: {
        controller: 'show'
      }
    },
    'addTocart': {
      method: 'POST',
      params: {
        controller: 'addTocart'
      }
    }
  });
}).factory('Address', function ($resource) {
  return $resource('/api/address/:id', {
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
    'productCount': {
      method: 'post',
      isArray: true,
      params: {
        controller: 'productCount'
      }
    },
    'addfeaturedPdt': {
      method: 'post',
      isArray: true,
      params: {
        controller: 'addfeaturedPdt',
        limit: null
      }
    },

    'removefeaturedPdt': {
      method: 'post',
      isArray: true,
      params: {
        controller: 'removefeaturedPdt',
        limit: null
      }
    },
    'amazonaffiliate': {
      method: 'post',
      params: {
        controller: 'amazonaffiliate'
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
}).service('stateService', function () {

  var states = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'cHattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep ', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
  var registry = {};
  var registrymethod = "";
  /*
    var addregistry = function(newObj) {
      registry = newObj;
    }*/

  var getstates = function getstates() {
    return states;
  };

  return {
    getstates: getstates
  };
});;

angular.module('bhcmartApp').service('NavbarService', function ($http, Catalog) {
  var tree = [];

  Catalog.query(function (categories) {
    var categories = categories;

    var parentCategories = _.filter(categories, function (category) {
      return category.ancestors.length == 1;
    });

    angular.forEach(parentCategories, function (value, key) {

      var parentcateogry = {
        "name": value.name,
        "slug": value.slug,
        "id": value._id
      };
      if (value.children.length > 0) {
        parentcateogry.subtree = [];
        angular.forEach(value.children, function (id, key) {
          var subCategories = _.filter(categories, function (category) {
            return category._id == id;
          });

          if (subCategories.length > 0) {
            var subcategory = {
              "name": subCategories[0].name,
              "slug": subCategories[0].slug,
              "id": subCategories[0]._id

            };
            if (subCategories[0].children && subCategories[0].children.length > 0) {
              subcategory.subtree = [];
              angular.forEach(subCategories[0].children, function (id, key) {
                var subsubCategories = _.filter(categories, function (category) {
                  return category._id == id;
                });

                if (subsubCategories.length > 0) {
                  var subsubcategory = {
                    "name": subsubCategories[0].name,
                    "slug": subsubCategories[0].slug,
                    "id": subsubCategories[0]._id

                  };
                  subcategory.subtree.push(subsubcategory);
                }
              });
            }
          }

          parentcateogry.subtree.push(subcategory);
        });
      }
      tree.push(parentcateogry);
    });
  });

  return {
    createnav: function createnav() {
      return tree;
    }
  };
});

angular.module('bhcmartApp').service('AlertService', function ($http, $mdDialog) {

  return {
    showAlert: function showAlert(title, content) {
      $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title(title).textContent(content).ok('Ok')
      // You can specify either sting with query selector
      .openFrom('#left')
      // or an element
      .closeTo(angular.element(document.querySelector('#right'))));
    }
  };
});
//# sourceMappingURL=product.service.js.map
