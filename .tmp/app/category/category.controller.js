'use strict';

angular.module('bhcmartApp').controller('CategoryCtrl', ['$scope', '$stateParams', 'Product', '$rootScope', '$state', function ($scope, $stateParams, Product, $rootScope, $state) {

  $scope.addtoRegistry = function (productId) {

    var result = { id: productId, registryId: $scope.registryId, registryTitle: $scope.registrytitle };
    $state.go('product', result);
  };

  $stateParams.slug == 'all' ? Product.query(process($scope)) : Product.catalog({ id: $stateParams.slug, limit: 0 }, process($scope));

  $scope.registryId = $rootScope.registryId;
  $scope.registrytitle = $rootScope.registryTitle;
}]);

var getAverageRating = function getAverageRating(p) {
  return Math.ceil(_.reduce(p.reviews, function (a, b) {
    return a + b.rating;
  }, 0) / p.reviews.length);
};

var process = function process($scope) {
  return function (prod) {
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
