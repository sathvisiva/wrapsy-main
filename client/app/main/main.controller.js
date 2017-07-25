'use strict';
/*
(function() {

  class MainController {

    constructor($http, $scope, $timeout, Catalog, $state,$stateParams,$rootScope,) {

      Catalog.query(function(categories) {
        $scope.categories = categories;
      });

      console.log($scope.categories)

      $scope.parentCategories = _.filter($scope.categories, function(category) {
        return category.ancestors.length == 1;
      })

      console.log($scope.parentCategories)


      let self = $scope;

      Catalog.query(function(categories) {
        self.categories = categories;
        self.allCategory = _.filter(categories, function(category) {
          return category.ancestors.length == 0;
        })
        let parentCategories = _.filter(categories, function(category) {
          return category.ancestors.length == 1 && category.slug != "upsell-products";
        })
        self.parentCategories = _.map(parentCategories, function(parentCategory) {
          parentCategory.children = _.map(parentCategory.children, function(childId) {
            if (childId)
              return _.find(categories, {
                "_id": childId
              })
          })
          return parentCategory
        });
      });

    }
  }

  angular.module('bhcmartApp')
  .controller('MainController', MainController);

})();*/


angular.module('bhcmartApp')
.controller('MainController', ['$scope', 'Catalog', 'Modal',
  function($scope, Catalog, Modal) {
    Catalog.query(function(categories) {
      $scope.categories = categories;
      $scope.parentCategories = _.filter(categories, function(category) {
        return category.ancestors.length == 1;
      })
      $scope.subparentCategories = _.filter(categories, function(category) {
        return category.ancestors.length == 2;
      })

      console.log($scope.subparentCategories);
    });
  }
  ])


