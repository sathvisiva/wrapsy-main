'use strict';

(function() {

  class ForgotPasswordController {


    constructor($http, $scope, $timeout, Auth, $state,User, $window, $mdDialog, $mdMedia) {
      $scope.user = {};
      $scope.errors = {};
      $scope.submitted = false;
      $scope.socialerror = false;
      $scope.registerd = false;




      $scope.changePassword = function(form) {
        $scope.submitted = true;
        $scope.user.email = 'sathvisiva@gmail.com'
        if (form.$valid) {
          console.log("insiede")
          Auth.changePassword($scope.user.email, $scope.user.newPassword)
          .then(() => {
            console.log("success");
            $scope.message = true
            $scope.successMessage = 'Your Password successfully changed';
          })
          .catch(err => {
            console.log(err)
            var error = err.data;
            if(error.includes('Social')){
              $scope.socialerror = true;
            }else if(error.includes('Invalid')) {
              $scope.registerd = true;
            }
            
          });


        }
      }


      $scope.login = function(ev,data) {
        $state.go('home');
        $mdDialog.show({
          controller: 'LoginController'
          , templateUrl: 'app/account/login/login.html'
          , parent: angular.element(document.body)
          , targetEvent: ev

          , clickOutsideToClose: true
          , locals: {
            dataToPass: {layout : data, state : "home"}
          }
        });

        $scope.$watch(function () {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }
      
      $scope.ResetPassword = function(form) {
        $scope.socialerror = false;
        $scope.registerd = false;

        if (form.$valid) {

          Auth.forgotPassword($scope.user.email)
          .then(() => {

            $scope.message = true;
            $scope.successMessage = "you will receive an email with a link to reset your password.";
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






