'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var LoginController = function LoginController($http, $scope, $timeout, socket, Auth, $state, User, toaster) {
    _classCallCheck(this, LoginController);

    $scope.user = {};
    $scope.errors = {};
    $scope.submitted = false;

    $scope.login = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        }).then(function () {
          // Logged in,home redirect to home
          $state.go('home');
        })['catch'](function (err) {
          console.log(err.message);
          $scope.errors.other = err.message;
        });
      }
    };
  };

  angular.module('bhcmartApp').controller('LoginController', LoginController);
})();
//# sourceMappingURL=login.controller.js.map
