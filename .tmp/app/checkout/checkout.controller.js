'use strict';

angular.module('bhcmartApp').controller('CheckoutCtrl', ['$scope', 'Auth', '$state', 'Order', 'ngCart', function ($scope, Auth, $state, Order, ngCart) {

  $scope.user = Auth.getCurrentUser() || {};
  $scope.user.country = "In";
  $scope.isLoggedIn = Auth.isLoggedIn();
  $scope.errors = {};
  $scope.submitted = false;

  $scope.states = [{
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

  $scope.login = function (form) {
    $scope.submitted = true;

    if (form.$valid) {
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      }).then(function () {
        $state.reload();
      })['catch'](function (err) {
        $scope.errors.other = err.message;
      });
    }
  };

  $scope.validate = function (form) {
    console.log($scope.user.state);

    if (form.$valid) {
      $scope.message = '';
      $scope.submitted = true;
    }
  };

  $scope.checkout = function (cart, user) {

    if (user.name && user.email && user.phone && user.address && user.city && user.country) {
      _.map(cart.items, function (i) {
        i.productId = i.id;
        delete i.data;
        delete i.id;
        return i;
      });

      cart = _.extend(cart, {
        customerId: user._id ? user._id : '',
        customerName: user.name,
        customerEmail: user.email,
        customerAddress: user.address,
        customerPhone: user.phone,
        customerCity: user.city,
        customerState: user.state ? user.state : '',
        customerCountry: user.country
      });

      Order.save(cart, function (resp) {
        ngCart.empty();
        $state.go('invoice', { id: resp._id });
      }, function (err) {
        console.log(err);
      });
    } else {
      $scope.message = 'Please, complete the shipping section and click on validate';
    }
  };
}]);
//# sourceMappingURL=checkout.controller.js.map
