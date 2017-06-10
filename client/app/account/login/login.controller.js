'use strict';

(function() {

  class LoginController {


    constructor($http, $scope, $timeout, socket, Auth, $state,User, toaster) {
      $scope.user = {};
      $scope.errors = {};
      $scope.submitted = false;
      
     
  $scope.login = function(form) {
        $scope.submitted = true;

    if (form.$valid) {
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then(() => {
        // Logged in,home redirect to home
        $state.go('home')
      })
      .catch(err => {
        console.log(err.message)
        $scope.errors.other = err.message;
      });
    }
  }


    
  }
}

angular.module('bhcmartApp')
.controller('LoginController', LoginController);

})();






