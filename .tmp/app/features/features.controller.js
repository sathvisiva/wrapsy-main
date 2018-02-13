'use strict';

angular.module('bhcmartApp').controller('FeaturesCtrl', ['$scope', 'Feature', 'Modal', '$mdDialog', function ($scope, Feature, Modal, $mdDialog) {

  $scope.query = function () {
    Feature.query(function (data) {
      $scope.features = data;
      $scope.currentPage = 1;
      $scope.totalItems = $scope.data.length;
      $scope.itemsPerPage = 5; // items per page
      $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
    });
  };

  $scope.query();

  $scope.save = function (form) {
    if (form.$valid) {

      Feature.save($scope.feature, function (resp) {
        $scope.feature = '';
        $scope.query();
      }, function (err) {
        console.log(err);
        $scope.message == err;
      });
    }
  };

  $scope.deletefeature = function (ev, feature) {
    var confirm = $mdDialog.confirm().title('Would you like to delete ' + feature.key + ' ' + feature.val + '?').ariaLabel('Delete Feature').targetEvent(ev).ok('Please do it!').cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
      $scope.status = 'ok';
      feature.$remove(feature._id, function (resp) {
        $scope.query();
      });
    }, function () {
      $scope.status = 'cancel';
      console.log($scope.status);
    });
  };

  Feature.group(function (data) {

    console.log(data);
  });
  /*
  
      Vendor.query(function(vendor) {
        $scope.vendor = vendor;
        console.log(vendor)
          
          $scope.currentPage = 1;
          $scope.totalItems = $scope.vendor.length;
          $scope.itemsPerPage = 2; // items per page
          $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        });
  
      $scope.propertyName = 'name';
      $scope.reverse = true;
  
      $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
      };
  
      $scope.deleteVendor = Modal.confirm.delete(function(c) {
  
        c.$remove(c._id, function(resp) {
          console.log(resp)
          $scope.vendor.splice($scope.vendor.indexOf(c), 1);
        })
      });*/
}]);
//# sourceMappingURL=features.controller.js.map
