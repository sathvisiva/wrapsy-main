'use strict';

angular.module('bhcmartApp')
  .controller('SearchCtrl', ['$scope', '$stateParams', 'products','$state', function($scope, $stateParams, products,$state) {
   	
   	$scope.addtoRegistry = function(productId){
        var result = { id:productId, registryId: $scope.registryId, registryTitle:$scope.registrytitle };
        $state.go('product', result);
      }

    $scope.products = products;
    console.log($stateParams.category, $stateParams.term);
  }]);
