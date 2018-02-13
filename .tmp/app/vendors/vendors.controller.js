'use strict';

angular.module('bhcmartApp').controller('ManageVendorsCtrl', ['$scope', 'Vendor', '$mdDialog', function ($scope, Vendor, $mdDialog) {

  Vendor.query(function (vendor) {
    $scope.vendor = vendor;
    console.log(vendor);
    // pagination controls
    $scope.currentPage = 1;
    $scope.totalItems = $scope.vendor.length;
    $scope.itemsPerPage = 3; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  });

  $scope.propertyName = 'name';
  $scope.reverse = true;

  $scope.sortBy = function (propertyName) {
    $scope.reverse = $scope.propertyName === propertyName ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };

  /* $scope.deleteVendor = Modal.confirm.delete(function(c) {
      c.$remove(c._id, function(resp) {
       console.log(resp)
       $scope.vendor.splice($scope.vendor.indexOf(c), 1);
     })
   });*/

  $scope.deleteVendor = function (ev, vendor) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm().title('Would you like to delete Vendor' + vendor.name + '?').textContent('Deleting the Vendor will also remove all the products added by the Vendor').ariaLabel('Delete Vendor').targetEvent(ev).ok('Please do it!').cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
      $scope.status = 'ok';
      vendor.$remove(vendor._id, function (resp) {
        console.log(resp);
        //$scope.vendor.splice($scope.vendor.indexOf(c), 1);
      });
    }, function () {
      $scope.status = 'cancel';
      console.log($scope.status);
    });
  };
}]).controller('VendorsEditCtrl', ['$scope', '$state', 'Vendor', '$stateParams', function ($scope, $state, Vendor, $stateParams) {

  $scope.vendor = Vendor.get({ id: $stateParams.id }, function (data) {
    console.log(data);
  });

  $scope.save = function (form) {
    if (form.$valid) {
      Vendor.update({ id: $scope.vendor._id }, $scope.vendor, function (resp) {
        console.log('updated', resp);
        $state.go('admin.vendors');
      }, function (err) {
        console.log(err);
      });
    }
  };
}]).controller('VendorsAddCtrl', ['$scope', '$state', 'Vendor', '$stateParams', function ($scope, $state, Vendor, $stateParams) {

  $scope.save = function (form) {
    if (form.$valid) {
      console.log($scope.vendor);
      Vendor.save($scope.vendor, function (resp) {
        $state.go('admin.vendors');
      }, function (err) {
        console.log(err);
        $scope.message == err;
      });
    }
  };
}]);
//# sourceMappingURL=vendors.controller.js.map
