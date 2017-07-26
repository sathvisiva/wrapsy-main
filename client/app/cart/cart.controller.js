'use strict';

angular.module('bhcmartApp')
.controller('CartCtrl', function($scope, Modal, ngCart, $state,$mdDialog) {
	$scope.clearCart = function(ev) {
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
 		
 	}
	
	
	
	$scope.removeProduct = function(ev,productName , product) {
	   var confirm = $mdDialog.confirm()
          .title('Confirm')
          .textContent('Would you like to remove' + productName + 'from your cart' )
          .ariaLabel('remove product')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('cancel');

    		$mdDialog.show(confirm).then(function() {
      			ngCart.removeItemById(product.getId());
    		}, function() {
     
    	   });
 		
 	}

	

	/*ui-sref="checkout"*/

	$scope.checkout = function(ev){
		if($scope.isLoggedIn()){
			$state.go('checkout');
		}else{
			$scope.data = {'state' : 'checkout' , 'event' : 'login'};
			$scope.login(ev, $scope.data);
		}
	}

});
