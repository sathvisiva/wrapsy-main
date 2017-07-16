'use strict';

class NavbarController {



  isCollapsed = true;
  //end-non-standard

  constructor(Auth, Catalog, $scope, $mdDialog, $state, $stateParams, $mdMedia) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.customFullscreen = false;

    $scope.createRegistry = function(ev){
      if($scope.isLoggedIn()){
        $state.go('createregistry');
      }else{
        $scope.data = {'state' : 'createregistry' , 'event' : 'login'};
        $scope.login(ev, $scope.data);
      }
    }

    $scope.login = function(ev,data) {
      $mdDialog.show({
        controller: 'LoginController'
        , templateUrl: 'app/account/login/login.html'
        , parent: angular.element(document.body)
        , targetEvent: ev
        
        , clickOutsideToClose: true
        , locals: {
          dataToPass: data
        }
      });

      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }




/*
    $scope.login = function(ev,data) {
      $mdDialog.show({
        locals: {badStudents : [1]},    
        templateUrl: 'app/account/login/login.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        hasBackdrop: true,
        clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
  };*/

}
}

angular.module('bhcmartApp')
.controller('NavbarController', NavbarController);
