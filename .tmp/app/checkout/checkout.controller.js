'use strict';

angular.module('bhcmartApp').controller('CheckoutCtrl', ['$scope', 'Auth', '$state', 'Order', 'ngCart', function ($scope, Auth, $state, Order, ngCart) {

  $scope.user = Auth.getCurrentUser() || {};
  $scope.isLoggedIn = Auth.isLoggedIn();
  $scope.errors = {};
  $scope.submitted = false;

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
    $scope.submitted = true;
    if (form.$valid) $scope.message = '';
  };

  $scope.checkout = function (cart, user) {

    console.log(cart);
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
