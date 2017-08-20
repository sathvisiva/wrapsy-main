'use strict';

class NavbarController {



  isCollapsed = true;
  //end-non-standard

  constructor(Auth, Catalog, $scope, $mdDialog, $state, $stateParams, $mdMedia) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showSearch = false;

    $scope.toggleSearch = function(){
      if($scope.showSearch){
        $scope.showSearch = false;
      }else{
        $scope.showSearch = true;
      }
    }


    $scope.createRegistry = function(ev){
      if($scope.isLoggedIn()){
        $state.go('createregistry.registryType');
      }else{
        $scope.data = {'state' : 'createregistry.registryType' , 'event' : 'login'};
        $scope.login(ev, $scope.data);
      }
    }

    $scope.login = function(ev,data) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: 'LoginController'
        , templateUrl: 'app/account/login/login.html'
        , parent: angular.element(document.body)
        , targetEvent: ev
        , fullscreen: useFullScreen
        , clickOutsideToClose: true
        , locals: {
          dataToPass: data
        }
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    
  }





}

angular.module('bhcmartApp')
.controller('NavbarController', NavbarController);
