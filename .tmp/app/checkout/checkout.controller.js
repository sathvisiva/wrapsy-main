'use strict';

angular.module('bhcmartApp').controller('CheckoutCtrl', ['$scope', 'Auth', '$state', 'Order', 'ngCart', 'toaster', function ($scope, Auth, $state, Order, ngCart, toaster) {
  $state.go('checkout.shipping');
  $scope.user = Auth.getCurrentUser() || {};
  $scope.user.country = "In";

  $scope.isLoggedIn = Auth.isLoggedIn();
  $scope.errors = {};
  $scope.submitted = false;

  $scope.disableorder = true;
  $scope.disablepayment = true;

  $scope.savelocation = function (form) {
    $scope.locationformsubmitted = false;
    if (!form.$valid) {
      $scope.locationformsubmitted = true;
    } else {
      $scope.disablemessage = false;
      $state.go('createregistry.message');
    }
  };

  $scope.validate = function (form) {
    if (!$scope.isLoggedIn) {
      toaster.pop('error', "Please login to continue");
    }
    console.log("state" + $scope.user.state);
    if (form.$valid && ($scope.user.state || $scope.user.state != "")) {
      $scope.message = '';
      $scope.submitted = true;
    } else {
      toaster.pop('error', "Please check the data entered");
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
        customerEmail: $scope.user.email,
        customerAddress: user.address,
        customerAddress1: user.address1,
        customerlandmark: user.landmark,
        customerPhone: user.phone,
        customerCity: user.city,
        customerState: user.state ? user.state : '',
        customerCountry: 'India'
      });

      Order.save(cart, function (resp) {
        ngCart.empty();
        $state.go('invoice', { id: resp._id });
      }, function (err) {
        toaster.pop('error', "Please Try again later");
      });
    } else {
      $scope.message = 'Please, complete the shipping section and click on continue';
    }
  };
}]);
//# sourceMappingURL=checkout.controller.js.map
