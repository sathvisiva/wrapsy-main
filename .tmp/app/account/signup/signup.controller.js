'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignupController = (function () {
  function SignupController(Auth, $state, $scope) {
    _classCallCheck(this, SignupController);

    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.states = [{
      "key": "AN",
      "name": "Andaman and Nicobar Islands"
    }, {
      "key": "AP",
      "name": "Andhra Pradesh"
    }, {
      "key": "AR",
      "name": "Arunachal Pradesh"
    }, {
      "key": "AS",
      "name": "Assam"
    }, {
      "key": "BR",
      "name": "Bihar"
    }, {
      "key": "CG",
      "name": "Chandigarh"
    }, {
      "key": "CH",
      "name": "Chhattisgarh"
    }, {
      "key": "DH",
      "name": "Dadra and Nagar Haveli"
    }, {
      "key": "DD",
      "name": "Daman and Diu"
    }, {
      "key": "DL",
      "name": "Delhi"
    }, {
      "key": "GA",
      "name": "Goa"
    }, {
      "key": "GJ",
      "name": "Gujarat"
    }, {
      "key": "HR",
      "name": "Haryana"
    }, {
      "key": "HP",
      "name": "Himachal Pradesh"
    }, {
      "key": "JK",
      "name": "Jammu and Kashmir"
    }, {
      "key": "JH",
      "name": "Jharkhand"
    }, {
      "key": "KA",
      "name": "Karnataka"
    }, {
      "key": "KL",
      "name": "Kerala"
    }, {
      "key": "LD",
      "name": "Lakshadweep"
    }, {
      "key": "MP",
      "name": "Madhya Pradesh"
    }, {
      "key": "MH",
      "name": "Maharashtra"
    }, {
      "key": "MN",
      "name": "Manipur"
    }, {
      "key": "ML",
      "name": "Meghalaya"
    }, {
      "key": "MZ",
      "name": "Mizoram"
    }, {
      "key": "NL",
      "name": "Nagaland"
    }, {
      "key": "OR",
      "name": "Odisha"
    }, {
      "key": "PY",
      "name": "Puducherry"
    }, {
      "key": "PB",
      "name": "Punjab"
    }, {
      "key": "RJ",
      "name": "Rajasthan"
    }, {
      "key": "SK",
      "name": "Sikkim"
    }, {
      "key": "TN",
      "name": "Tamil Nadu"
    }, {
      "key": "TS",
      "name": "Telangana"
    }, {
      "key": "TR",
      "name": "Tripura"
    }, {
      "key": "UP",
      "name": "Uttar Pradesh"
    }, {
      "key": "UK",
      "name": "Uttarakhand"
    }, {
      "key": "WB",
      "name": "West Bengal"
    }];

    this.Auth = Auth;
    this.$state = $state;
  }

  _createClass(SignupController, [{
    key: "register",
    value: function register(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        }).then(function () {
          // Account created, redirect to home
          window.history.back();
        })["catch"](function (err) {
          err = err.data;
          _this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function (error, field) {
            form[field].$setValidity('mongoose', false);
            _this.errors[field] = error.message;
          });
        });
      }
    }
  }]);

  return SignupController;
})();

angular.module('bhcmartApp').controller('SignupController', SignupController);

//start-non-standard

//end-non-standard
//# sourceMappingURL=signup.controller.js.map
