'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var SettingsController = function SettingsController($http, $scope, $timeout, socket, Auth, $state, User, toaster) {
    _classCallCheck(this, SettingsController);

    $scope.user = {};
    $scope.errors = {};
    $scope.submitted = false;

    $scope.changePassword = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        console.log("insiede");
        Auth.changePassword($scope.user.email, $scope.user.newPassword).then(function () {
          console.log("success");
          $scope.message = 'Password successfully changed.';
        })["catch"](function () {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
    };
  };

  angular.module('bhcmartApp').controller('SettingsController', SettingsController);
})();
//# sourceMappingURL=settings.controller.js.map
