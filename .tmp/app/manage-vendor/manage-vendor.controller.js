'use strict';

angular.module('bhcmartApp').controller('ManageFeaturesCtrl', ['$scope', 'Product', 'Modal', function ($scope, Product, Modal) {

  Product.indexFeatures(function (features) {
    console.log(features);
    $scope.features = features;
    $scope.currentPage = 1;
    $scope.totalItems = $scope.features.length;
    $scope.itemsPerPage = 10; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  });

  /*     Product.query(function(products) {
         $scope.products = products;
         // pagination controls
         $scope.currentPage = 1;
         $scope.totalItems = $scope.products.length;
         $scope.itemsPerPage = 10; // items per page
         $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
       });*/

  $scope.deleteFeature = Modal.confirm['delete'](function (f) {
    Product.destroyFeature({ id: f._id }, f).$promise.then(function (res) {
      console.log(res);
      $scope.features.splice($scope.features.indexOf(f), 1);
    });

    /*  f.$remove(f._id, function(resp) {
        console.log(resp)
        
      })*/
  });
}]).controller('ManageFeaturesAddCtrl', ['$scope', '$state', 'Product', 'Upload', function ($scope, $state, Product, Upload) {

  $scope.save = function (form) {
    $scope.feature.value = $scope.feature.value.split(',');
    if (form.$valid) {
      Product.features($scope.feature, function (resp) {
        console.log(resp);
        $state.go('adminconsole.featureslist');
      }, function (err) {
        console.log(err);
      });
    }
  };
}]);
//# sourceMappingURL=manage-vendor.controller.js.map
