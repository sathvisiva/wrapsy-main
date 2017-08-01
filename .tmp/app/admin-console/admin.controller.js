'use strict';

angular.module('bhcmartApp').controller('AdminCtrl', function ($scope, Modal, ngCart, $state, $mdDialog, Order) {
  /*	$scope.clearCart = function(ev) {
      var confirm = $mdDialog.confirm()
      .title('Confirm')
      .textContent('Would you like to remove all the items from your cart' )
      .ariaLabel('remove product')
      .targetEvent(ev)
      .ok('Please do it!')
      .cancel('cancel');
  
      $mdDialog.show(confirm).then(function() {
       ngCart.empty()
     }, function() {
  
     });
  
   }*/

  $scope.orderstatus = [{ id: 1, status: "Processed" }, { id: 2, status: "Complete" }, { id: 3, status: "Open" }, { id: 3, status: "Canceled" }];

  $scope.viewOrders = function () {
    Order.query(function (orders) {
      $scope.orders = orders;
      // pagination controls
      $scope.currentPage = 1;
      $scope.totalItems = $scope.orders.length;
      $scope.itemsPerPage = 10; // items per page
      $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
    });
    console.log($scope.orders);
    $state.go('admin-console.orders');
  };

  $scope.removeProduct = function (ev, productName, product) {
    var confirm = $mdDialog.confirm().title('Confirm').textContent('Would you like to remove' + productName + 'from your cart').ariaLabel('remove product').targetEvent(ev).ok('Please do it!').cancel('cancel');

    $mdDialog.show(confirm).then(function () {
      ngCart.removeItemById(product.getId());
    }, function () {});
  };

  /*ui-sref="checkout"*/

  $scope.checkout = function (ev) {
    if ($scope.isLoggedIn()) {
      $state.go('checkout');
    } else {
      $scope.data = { 'state': 'checkout', 'event': 'login' };
      $scope.login(ev, $scope.data);
    }
  };
});
//# sourceMappingURL=admin.controller.js.map
