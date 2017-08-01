'use strict';

angular.module('bhcmartApp')
.controller('OrdersCtrl', ['$scope', 'Order', 'Auth', 'Modal', function($scope, Order, Auth, Modal) {
  var user = Auth.getCurrentUser();
  $scope.isAdmin = Auth.hasRole('admin');

  $scope.orderstatus = [
  {id : 1, status : "Processed"},
  {id : 2, status : "Complete"},
  {id : 3, status : "Open"},
  {id : 3, status : "Canceled"}
  ];

  $scope.searchOptions = [
  {id : 1, option : "Order #"},
  {id : 2, option : "Customer Name"},
  {id : 3, option : "Status"},
  {id : 3, option : "Date"}
  ];

  if ($scope.isAdmin)
    Order.query(function(orders) {
      $scope.orders = orders;
        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.orders.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });
  else{
    Order.myOrders({ id: user._id }, function(orders) {
      $scope.orders = orders;
        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.orders.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });
  }

  $scope.deleteOrder = Modal.confirm.delete(function(o) {
    o.$remove(o._id, function(resp) {
      console.log(resp)
      $scope.orders.splice($scope.orders.indexOf(o), 1);
    })
  });

  $scope.deliverOrder = Modal.confirm.deliver(function(o) {
    o.delivered = o.delivered ? false : true;
    o.$update(function(resp) {
      console.log(resp)
    })
  });

  $scope.cancelOrder = Modal.confirm.cancel(function(o) {
    o.delivered = o.delivered ? false : true;
    o.$updateCancel(function(resp) {
      console.log(resp)
    })
  });
}]);
