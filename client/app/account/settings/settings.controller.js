'use strict';

(function() {

  class SettingsController {


    constructor($http, $scope, $timeout, socket, Auth, $state,User, toaster) {
      $scope.user = {};
      $scope.errors = {};
      $scope.submitted = false;
      
     
  $scope.changePassword = function(form) {
        $scope.submitted = true;

    if (form.$valid) {
      console.log("insiede")
      Auth.changePassword($scope.user.email, $scope.user.newPassword)
        .then(() => {
          console.log("success");
          $scope.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
  
    }
  }


    
  }
}

angular.module('bhcmartApp')
.controller('SettingsController', SettingsController);

})();






