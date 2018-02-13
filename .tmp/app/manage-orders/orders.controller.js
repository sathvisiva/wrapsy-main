'use strict';

angular.module('bhcmartApp').controller('ManageOrdersCtrl', ['$scope', 'Order', 'Auth', 'Modal', function ($scope, Order, Auth, Modal) {
  var user = Auth.getCurrentUser();
  $scope.isAdmin = Auth.hasRole('admin');

  Order.query(function (orders) {
    $scope.orders = orders;

    $scope.currentPage = 1;
    $scope.totalItems = $scope.orders.length;
    $scope.itemsPerPage = 10; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  });

  $scope.updatestatus = function (order, product, status) {
    $scope.order = {};
    $scope.order.id = order;
    $scope.order.product = product;
    $scope.order.status = status;
    console.log($scope.order);
    Order.updateStatus($scope.order, function (data) {
      console.log(data);
    });
  };

  $scope.deleteOrder = Modal.confirm['delete'](function (o) {
    o.$remove(o._id, function (resp) {
      console.log(resp);
      $scope.orders.splice($scope.orders.indexOf(o), 1);
    });
  });

  $scope.deliverOrder = Modal.confirm.deliver(function (o) {
    o.delivered = o.delivered ? false : true;
    o.$update(function (resp) {
      console.log(resp);
    });
  });
}]);
//# sourceMappingURL=orders.controller.js.map
