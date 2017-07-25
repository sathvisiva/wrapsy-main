'use strict';

angular.module('bhcmartApp').controller('CheckoutCtrl', ['$scope', 'Auth', '$state', 'Order', 'ngCart', 'toaster', 'Voucher', function ($scope, Auth, $state, Order, ngCart, toaster, Voucher) {
  $state.go('checkout.shipping');
  $scope.user = Auth.getCurrentUser() || {};
  $scope.user.country = "In";

  $scope.isLoggedIn = Auth.isLoggedIn();
  $scope.errors = {};
  $scope.submitted = false;

  $scope.disableorder = true;
  $scope.disablepayment = true;

  var q = { where: { email: Auth.getCurrentUser().email } };
  /* $scope.vouchers =  Voucher.query(q);
   console.log($scope.vouchers)
   */

  /*
    $scope.savelocation = function(form){
      $scope.locationformsubmitted = false;
      if (!form.$valid) {
        $scope.locationformsubmitted = true
      }else{
        $scope.disablemessage = false;
        $state.go('createregistry.message');
      }
  
    }*/

  $scope.redeemVoucher = function (voucher1) {
    var data = { code: voucher1 };
    Voucher.redeem(data, function (resp) {}, function (err) {
      console.log(err);
    });
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
