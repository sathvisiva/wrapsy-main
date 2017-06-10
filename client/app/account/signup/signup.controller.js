'use strict';

(function() {

  class SignupController {


    constructor($http, $scope, $timeout, socket, Auth, $state,User, toaster) {
      $scope.user = {};
      $scope.errors = {};
      $scope.submitted = false;
      
      $scope.inputChanged = function(){
        $scope.duplicate = false;
        var q = {where:{email: $scope.user.email}};
        $scope.existingUser = User.query(q,function(data){
            if(data.length > 0){
              $scope.duplicate = true
              console.log($scope.duplicate)
            }
        });

     }



  $scope.register = function(form) {
    $scope.submitted = true;

    if (form.$valid) {
      Auth.createUser({
        name: $scope.user.name,
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then(() => {
        // Account created, redirect to home
        $state.go('home')
      })
      .catch(err => {
        err = err.data;
        $scope.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          $scope.errors[field] = error.message;
        });
      });
    }
  }


    
  }
}

angular.module('bhcmartApp')
.controller('SignupController', SignupController);

})();






