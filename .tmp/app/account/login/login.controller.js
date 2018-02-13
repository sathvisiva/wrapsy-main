'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var LoginController = function LoginController($http, $scope, $timeout, Auth, $state, User, $mdDialog, $window, dataToPass, Cart, $uibModal) {
    _classCallCheck(this, LoginController);

    $scope.dataToPass = dataToPass;
    if (dataToPass) {
      if (dataToPass.event == 'login') {
        $scope.loginlayout = true;
        $scope.signup = false;
      } else {
        $scope.loginlayout = false;
        $scope.signup = true;
      }
    } else {
      $scope.loginlayout = true;
    }
    $scope.user = {};
    $scope.errors = {};
    $scope.submitted = false;

    $scope.forgotlayout = false;
    $scope.unregistered = false;$scope.incorrectpassword = false;

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.switchsigninlayout = function () {
      $scope.loginlayout = false;
      $scope.signup = true;
    };

    $scope.switchloginlayout = function () {
      $scope.loginlayout = true;
      $scope.signup = false;
    };

    $scope.register = function (form) {
      $scope.submitted = true;
      console.log(form.$valid);
      if (form.$valid) {

        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        }).then(function () {
          if ($scope.dataToPass) {
            if ($scope.dataToPass.state == 'cart') {
              Cart.addTocart({ id: Auth.getCurrentUser()._id }, $scope.dataToPass.items, function (res) {
                console.log(res);
                var modalInstance = $uibModal.open({
                  templateUrl: 'app/cart/cart.html',
                  controller: 'CartCtrl',
                  size: 'lg'
                });
              }, function (err) {
                var title = "Sorry product cannot be added to Cart";
                AlertService.showAlert(err.data);
              });
            } else {
              $state.go($scope.dataToPass.state);
            }
          }
          $scope.cancel();
        })['catch'](function (err) {
          err = err.data;
          console.log(err);
          $scope.errors.other = err.message;
        });
      }
    };
    $scope.login = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        }).then(function () {
          if ($scope.dataToPass) {
            if ($scope.dataToPass.state == 'cart') {
              if ($scope.dataToPass.items) {
                Cart.addTocart({ id: Auth.getCurrentUser()._id }, $scope.dataToPass.items, function (res) {
                  var modalInstance = $uibModal.open({
                    templateUrl: 'app/cart/cart.html',
                    controller: 'CartCtrl',
                    size: 'lg'
                  });
                }, function (err) {
                  var title = "Sorry product cannot be added to Cart";
                  AlertService.showAlert(err.data);
                });
              } else {
                var modalInstance = $uibModal.open({
                  templateUrl: 'app/cart/cart.html',
                  controller: 'CartCtrl',
                  size: 'lg'
                });
              }
            } else {
              $state.go($scope.dataToPass.state);
            }
          }
          $scope.cancel();
        })['catch'](function (err) {
          if (err.message == '1') {
            $scope.unregistered = true;
          } else if (err.message == '2') {
            $scope.incorrectpassword = true;
          } else {
            $scope.errors.other = err.message;
          }
        });
      }
    };

    $scope.loginOauth = function (provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.switchforgotlayout = function () {
      $mdDialog.cancel();
      $state.go('forgotPassword');
    };
  };

  angular.module('bhcmartApp').controller('LoginController', LoginController);
})();
//# sourceMappingURL=login.controller.js.map
