'use strict';

angular.module('bhcmartApp').factory('Order', function ($resource) {
  return $resource('/api/orders/:id/:controller', {
    id: '@_id'
  }, {
    'update': { method: 'PUT' },
    'myOrders': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'myorders'
      }
    },
    'countorders': {
      method: 'POST',
      isArray: true,
      params: {
        controller: 'countorders'
      }
    },
    'updateCancel': {
      method: 'POST',
      params: {
        controller: 'updateCancel'
      }
    },
    'countorder': {
      method: 'GET',
      params: {
        controller: 'countorder'
      }
    },
    //updateVoucher
    'updateVoucher': {
      method: 'POST',
      params: {
        controller: 'updateVoucher'
      }
    }

  });
});

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
//# sourceMappingURL=order.service.js.map
