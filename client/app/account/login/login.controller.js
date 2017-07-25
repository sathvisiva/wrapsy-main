'use strict';

(function() {

  class LoginController {


    constructor($http, $scope, $timeout, Auth, $state,User, $mdDialog, $window, dataToPass) {
      $scope.dataToPass = dataToPass
      if(dataToPass){ 
        if(dataToPass.event == 'login'){
         $scope.loginlayout = true;
         $scope.signup = false;
       }else{
        $scope.loginlayout = false;
        $scope.signup = true;
      }
    }else{
      $scope.loginlayout = true;
    }
    $scope.user = {};
    $scope.errors = {};
    $scope.submitted = false;
    
    $scope.forgotlayout = false;
    $scope.unregistered = false; $scope.incorrectpassword = false; 


    $scope.cancel = function() {
      $mdDialog.cancel();
    }

    $scope.switchsigninlayout = function(){
      $scope.loginlayout = false;
      $scope.signup = true;
    }

    $scope.switchloginlayout = function(){
      $scope.loginlayout = true;
      $scope.signup = false;
    }


    $scope.register = function(form) {
      $scope.submitted = true;
      console.log(form.$valid)
      if (form.$valid) {

        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(() => {
          if($scope.dataToPass){
            $state.go($scope.dataToPass.state);
          }
          $scope.cancel();

        })
        .catch(err => {
          err = err.data;
          console.log(err)
          $scope.errors.other = err.message;

        });
      }
    }
    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(() => {
          if($scope.dataToPass){
            $state.go($scope.dataToPass.state);
          }
          $scope.cancel();

        })
        .catch(err => {
          if(err.message == '1'){
            $scope.unregistered = true;
          }else if(err.message == '2'){
            $scope.incorrectpassword = true;
          }else{
            $scope.errors.other = err.message;
          }
        });
      }
    }

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.switchforgotlayout = function(){
      $mdDialog.cancel();
      $state.go('forgotPassword');
    }

  }
}

angular.module('bhcmartApp')
.controller('LoginController', LoginController);

})();






