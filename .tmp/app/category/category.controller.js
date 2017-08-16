'use strict';

angular.module('bhcmartApp').controller('CategoryCtrl', ['$scope', '$stateParams', 'Product', '$rootScope', '$state', 'Catalog', function ($scope, $stateParams, Product, $rootScope, $state, Catalog) {

  $scope.categoryTitle = $stateParams.slug;

  $scope.sizes = ["S", "M", "L", "XL", "XXL"];
  $scope.colors = ["Blue", "Brown", "Green", "Red"];
  $scope.pricerange = ["0 -500", "500-5000", "5000 +"];

  $scope.page = 0;

  $scope.priceSlider = {};

  $scope.priceSlider = {
    min: 0,
    max: 10000,
    ceil: 10000,
    floor: 0,
    step: 100
  };

  Catalog.query(function (categories) {
    $scope.categories = categories;
    $scope.parentCategories = _.filter(categories, function (category) {
      return category.ancestors.length == 1;
    });

    console.log($scope.parentCategories);
  });

  $scope.productCount = Product.productCount();
  console.log($scope.productCount);

  $scope.nextPage = function () {
    $scope.page = $scope.page + 1;
    $stateParams.slug == 'all' ? Product.query(process($scope)) : Product.catalog({ id: $stateParams.slug, limit: 4, page: $scope.page }, process($scope));
  };

  $scope.previousPage = function () {
    $scope.page = $scope.page - 1;

    $stateParams.slug == 'all' ? Product.query(process($scope)) : Product.catalog({ id: $stateParams.slug, limit: 4, page: $scope.page }, q);
  };

  $scope.test = function () {
    console.log("inside filter");
  };

  function test() {
    alert("inside test");
  }

  var q = {};
  var f = [];
  f.push({ 'color': { $in: ["pale", "bown"] } });
  f.push({ 'size': { $in: ["S", "M"] } });
  q.where = { 'color': { $in: ["pale", "bown"] } };

  $scope.searchProducts = Product.query(q);
  console.log("searchProd");
  console.log($scope.searchProducts);

  $stateParams.slug == 'all' ? Product.query(process($scope)) : Product.catalog({ id: $stateParams.slug, limit: 20, page: $scope.page }, process($scope));

  $scope.registryId = $rootScope.registryId;
  $scope.registrytitle = $rootScope.registryTitle;

  /*$scope.pricerange = "price";*/
  $scope.asc = false;

  /*$scope.minRangeSlider = {
    minValue: 100,
    maxValue: 180,
    options: {
      floor: 0,
      ceil: 1000000,
      step : 100
    }
  };*/
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
