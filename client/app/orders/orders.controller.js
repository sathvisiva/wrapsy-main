'use strict';

angular.module('bhcmartApp')
.controller('OrdersCtrl', ['$scope', 'Order', 'Auth', 'Modal','Request','$mdDialog', function($scope, Order, Auth, Modal,Request,$mdDialog) {
  var user = Auth.getCurrentUser();
  $scope.isAdmin = Auth.hasRole('admin');

  $scope.displayorders = function(){
    Order.myOrders({ id: user._id }, function(orders) {
      console.log(orders);
      $scope.orders = orders;
        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.orders.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });

  }

  $scope.displayorders();

  $scope.deleteOrder = Modal.confirm.delete(function(o) {
    o.$remove(o._id, function(resp) {
      console.log(resp)
      $scope.orders.splice($scope.orders.indexOf(o), 1);
    })
  });

  $scope.cancelorder = function(ev, orderid, ordernum) {
    $scope.request = {}
    $scope.request.customerId = user._id;
    $scope.request.orderId = orderid;
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.prompt()
    .title('Do you want to cancel the Order ' + ordernum)
    .textContent('please state a reason')
    .placeholder('reason')
    .ariaLabel('reason')
    .initialValue('reason')
    .targetEvent(ev)
    .ok('cancel order')
    .cancel('dismiss');

    $mdDialog.show(confirm).then(function(result) {
      $scope.request.cancel = true;
      $scope.request.reason = result;
      
      Request.save($scope.request, function(res){
        $scope.displayorders();

      })
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
  };

  $scope.returnProduct = function(ev, order , productid, productname) {
    $scope.request = {}
    $scope.request.customerId = user._id;
    $scope.request.orderId = order;
    $scope.request.products = productid;
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.prompt()
    .title('Do you want to return the Product ' + productname)
    .textContent('please state a reason')
    .placeholder('reason')
    .ariaLabel('reason')
    .initialValue('reason')
    .targetEvent(ev)
    .ok('Return Product')
    .cancel('dismiss');

    $mdDialog.show(confirm).then(function(result) {
      $scope.request.return = true;
      $scope.request.reason = result;
      
      Request.save($scope.request, function(res){
        console.log(res)
        $scope.displayorders();

      })
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
  };

  $scope.deliverOrder = Modal.confirm.deliver(function(o) {
    o.delivered = o.delivered ? false : true;
    o.$update(function(resp) {
      console.log(resp)
    })
  });
}]);
