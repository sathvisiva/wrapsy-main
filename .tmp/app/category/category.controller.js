'use strict';

angular.module('bhcmartApp').controller('CategoryCtrl', ['$scope', '$stateParams', 'Product', '$rootScope', '$state', 'Catalog', function ($scope, $stateParams, Product, $rootScope, $state, Catalog) {

  $scope.categoryTitle = $stateParams.slug;
  $scope.addtoRegistry = function (productId) {

    var result = { id: productId, registryId: $scope.registryId, registryTitle: $scope.registrytitle };
    $state.go('product', result);
  };

  Catalog.query(function (categories) {
    $scope.categories = categories;
    $scope.parentCategories = _.filter(categories, function (category) {
      return category.ancestors.length == 1;
    });
  });

  $scope.filter = function () {
    console.log("inside filter");
  };

  $stateParams.slug == 'all' ? Product.query(process($scope)) : Product.catalog({ id: $stateParams.slug, limit: 0 }, process($scope));

  $scope.registryId = $rootScope.registryId;
  $scope.registrytitle = $rootScope.registryTitle;

  $scope.pricerange = "price";
  $scope.asc = false;

  $scope.minRangeSlider = {
    minValue: 10,
    maxValue: 90,
    options: {
      floor: 0,
      ceil: 100,
      step: 1
    }
  };
}]);

var getAverageRating = function getAverageRating(p) {
  return Math.ceil(_.reduce(p.reviews, function (a, b) {
    return a + b.rating;
  }, 0) / p.reviews.length);
};

var process = function process($scope) {
  return function (prod) {
    console.log(prod);
    $scope.products = _.map(prod, function (rP) {
      return _.extend(rP, { averageRating: getAverageRating(rP) });
    });
    // pagination controls
    $scope.currentPage = 1;
    $scope.totalItems = $scope.products.length;
    $scope.itemsPerPage = 20; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  };
};
//# sourceMappingURL=category.controller.js.map
