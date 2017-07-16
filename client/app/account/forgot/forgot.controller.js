'use strict';

(function() {

  class ForgotPasswordController {


    constructor($http, $scope, $timeout, Auth, $state,User, $window) {
      $scope.user = {};
      $scope.errors = {};
      $scope.submitted = false;
      $scope.socialerror = false;
      $scope.registerd = false;
      
      $scope.ResetPassword = function(form) {
        $scope.socialerror = false;
        $scope.registerd = false;

        if (form.$valid) {

          Auth.forgotPassword($scope.user.email)
          .then(() => {
            console.log("success");
            $scope.message = 'Password successfully changed.';
          })
          .catch(err => {
            var error = err.data;
            if(error.includes('Social')){
              $scope.socialerror = true;
            }else if(error.includes('Invalid')) {
              $scope.registerd = true;
            }
            
          });

        }
      }

      $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
      };




    }
  }

  angular.module('bhcmartApp')
  .controller('ForgotPasswordController', ForgotPasswordController);

})();






