'use strict';

(function() {

  class AffiliateController {


    constructor($http, $scope, $timeout, socket, Catalog, Product,$uibModal,Auth, $state, Registry) {
    	 $scope.isLoggedIn = Auth.isLoggedIn;

      $scope.products = Product.affiliate()
      $



      $scope.selectRegistryType = function(){
        
        if(!$scope.isLoggedIn()){
          $state.go('login');
        }
        else{
    		var modalInstance = $uibModal.open({
    			templateUrl : 'app/home/registryType.html',
    			controller: 'RegistryTypeCtrl',
    			size :'md'
    		})
      }
    	}

            $scope.myregistries = function(){

            var q = {count:{username:Auth.getCurrentUser().name}};
            q._id = 1;

            Registry.query(q,function(data) {
              console.log(data)
              if(data.length == 1){
                $state.go('manageregistry', {id: data[0]._id});
              }else{
                $scope.openregistryList(data);
              }

            });
          }

            $scope.number2 = [{label: 1, otherLabel: 1}, {label: 2, otherLabel: 2}, {label: 3, otherLabel: 3}, {
      label: 4,
      otherLabel: 4
    }, {label: 5, otherLabel: 5}, {label: 6, otherLabel: 6}, {label: 7, otherLabel: 7}, {label: 8, otherLabel: 8}];

        $scope.slickConfig3Loaded = true;
    $scope.slickConfig3 = {
      method: {},
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };


 
    }
  }

  angular.module('bhcmartApp')
    .controller('AffiliateController', AffiliateController);

})();


