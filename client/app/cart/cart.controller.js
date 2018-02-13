'use strict';

angular.module('bhcmartApp')
.controller('CartCtrl', ['$scope', 'Cart', 'Auth', 'Modal','$rootScope','$state','$uibModalInstance', function($scope, Cart, Auth, Modal, $rootScope,$state , $uibModalInstance) {
	$rootScope.ip

	

	$scope.displaycarItems = function(){
		$scope.items = Cart.show({id : Auth.getCurrentUser()._id}, function(res){
			$scope.items = res.items;
			$scope.subtotal = 0;
			for(var i= 0 ;i < $scope.items.length; i++ ){
				$scope.subtotal += $scope.items[i].subtotal;
			}
		});
	}


	$scope.cancel = function(){
		$uibModalInstance.close(); 	
	}

	$scope.displaycarItems()

	$scope.changeQuantity = function(quantity , product , price, gst){
		
		$scope.incitems = {}
        var gst = (parseInt(gst) * 0.01 * parseInt(price)) + parseInt(price);
        $scope.incitems.subtotal = parseInt(quantity) * gst;
		$scope.incitems.product  = product;
		$scope.incitems.quantity = quantity;
		console.log($scope.incitems)
		Cart.alterpdtQuantity({id : Auth.getCurrentUser()._id},$scope.incitems,function(res){
			console.log(res);
			$scope.displaycarItems()
		})
	}

	$scope.checkout = function(){
		console.log('inside checkout')
		$state.go('checkout');
		$uibModalInstance.close(); 

	}


	$scope.continueShop = function(){
		console.log("inside continue shop")
		$state.go('main');
		$uibModalInstance.close(); 
	}

	

	$scope.removeItem = function(product, qty){
		$scope.incitems = {};
		$scope.incitems.product  = product;
		$scope.incitems.qty = qty;
		Cart.modifyCart({id : Auth.getCurrentUser()._id},$scope.incitems,function(res){
			console.log(res);
			$scope.displaycarItems()
		})
	}


	$scope.clearCart = function(){
		$scope.incitems = {}
		$scope.incitems.product  = 'test'
		Cart.clearCart({id : Auth.getCurrentUser()._id},$scope.incitems,function(res){
			console.log(res);
			$scope.displaycarItems()
		})

	}

}]);