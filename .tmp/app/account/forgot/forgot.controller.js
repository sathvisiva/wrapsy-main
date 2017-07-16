'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var ForgotPasswordController = function ForgotPasswordController($http, $scope, $timeout, Auth, $state, User, $window) {
    _classCallCheck(this, ForgotPasswordController);

    $scope.user = {};
    $scope.errors = {};
    $scope.submitted = false;
    $scope.socialerror = false;
    $scope.registerd = false;

    $scope.ResetPassword = function (form) {
      $scope.socialerror = false;
      $scope.registerd = false;

      if (form.$valid) {

        Auth.forgotPassword($scope.user.email).then(function () {
          console.log("success");
          $scope.message = 'Password successfully changed.';
        })['catch'](function (err) {
          var error = err.data;
          if (error.includes('Social')) {
            $scope.socialerror = true;
          } else if (error.includes('Invalid')) {
            $scope.registerd = true;
          }
        });
      }
    };

    $scope.loginOauth = function (provider) {
      $window.location.href = '/auth/' + provider;
    };
  };

  angular.module('bhcmartApp').controller('ForgotPasswordController', ForgotPasswordController);
})();
//# sourceMappingURL=forgot.controller.js.map
