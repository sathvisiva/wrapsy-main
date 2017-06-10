'use strict';

angular.module('bhcmartApp')
  .controller('CartCtrl', function($scope, Modal, ngCart) {
    console.log(ngCart.getCart().items)
    $scope.clearCart = Modal.confirm.delete(function() {
      ngCart.empty()
  	});

  	$scope.removeProduct = Modal.confirm.remove(function(o) {
     ngCart.removeItemById(o.getId())
    });
    
  });
