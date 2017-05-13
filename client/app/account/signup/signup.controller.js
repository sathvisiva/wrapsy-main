'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

states = [
{
"key": "AN",
"name": "Andaman and Nicobar Islands"
},
{
"key": "AP",
"name": "Andhra Pradesh"
},
{
"key": "AR",
"name": "Arunachal Pradesh"
},
{
"key": "AS",
"name": "Assam"
},
{
"key": "BR",
"name": "Bihar"
},
{
"key": "CG",
"name": "Chandigarh"
},
{
"key": "CH",
"name": "Chhattisgarh"
},
{
"key": "DH",
"name": "Dadra and Nagar Haveli"
},
{
"key": "DD",
"name": "Daman and Diu"
},
{
"key": "DL",
"name": "Delhi"
},
{
"key": "GA",
"name": "Goa"
},
{
"key": "GJ",
"name": "Gujarat"
},
{
"key": "HR",
"name": "Haryana"
},
{
"key": "HP",
"name": "Himachal Pradesh"
},
{
"key": "JK",
"name": "Jammu and Kashmir"
},
{
"key": "JH",
"name": "Jharkhand"
},
{
"key": "KA",
"name": "Karnataka"
},
{
"key": "KL",
"name": "Kerala"
},
{
"key": "LD",
"name": "Lakshadweep"
},
{
"key": "MP",
"name": "Madhya Pradesh"
},
{
"key": "MH",
"name": "Maharashtra"
},
{
"key": "MN",
"name": "Manipur"
},
{
"key": "ML",
"name": "Meghalaya"
},
{
"key": "MZ",
"name": "Mizoram"
},
{
"key": "NL",
"name": "Nagaland"
},
{
"key": "OR",
"name": "Odisha"
},
{
"key": "PY",
"name": "Puducherry"
},
{
"key": "PB",
"name": "Punjab"
},
{
"key": "RJ",
"name": "Rajasthan"
},
{
"key": "SK",
"name": "Sikkim"
},
{
"key": "TN",
"name": "Tamil Nadu"
},
{
"key": "TS",
"name": "Telangana"
},
{
"key": "TR",
"name": "Tripura"
},
{
"key": "UP",
"name": "Uttar Pradesh"
},
{
"key": "UK",
"name": "Uttarakhand"
},
{
"key": "WB",
"name": "West Bengal"
}
]




  constructor(Auth, $state, $scope) {
    this.Auth = Auth;
    this.$state = $state;
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Account created, redirect to home
        window.history.back();
      })
      .catch(err => {
        err = err.data;
        this.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });
      });
    }
  }
}

angular.module('bhcmartApp')
  .controller('SignupController', SignupController);
