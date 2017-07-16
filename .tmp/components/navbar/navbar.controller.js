'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var NavbarController =
//end-non-standard

function NavbarController(Auth, Catalog, $scope, $mdDialog, $state, $stateParams, $mdMedia) {
  _classCallCheck(this, NavbarController);

  this.isCollapsed = true;

  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;
  $scope.customFullscreen = false;

  $scope.createRegistry = function (ev) {
    if ($scope.isLoggedIn()) {
      $state.go('createregistry');
    } else {
      $scope.data = { 'state': 'createregistry', 'event': 'login' };
      $scope.login(ev, $scope.data);
    }
  };

  $scope.login = function (ev, data) {
    $mdDialog.show({
      controller: 'LoginController',
      templateUrl: 'app/account/login/login.html',
      parent: angular.element(document.body),
      targetEvent: ev,

      clickOutsideToClose: true,
      locals: {
        dataToPass: data
      }
    });

    $scope.$watch(function () {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function (wantsFullScreen) {
      $scope.customFullscreen = wantsFullScreen === true;
    });
  };

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
};

angular.module('bhcmartApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=navbar.controller.js.map
