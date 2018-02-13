'use strict';

angular.module('bhcmartApp').controller('CheckoutCtrl', ['$scope', 'Auth', '$state', 'Order', 'toaster', 'Voucher', 'Address', 'Payment', '$uibModal', 'stateService', 'Cart', function ($scope, Auth, $state, Order, toaster, Voucher, Address, Payment, $uibModal, stateService, Cart) {
  $state.go('checkout.shipping');
  $scope.user = Auth.getCurrentUser() || {};
  $scope.user.country = "In";

  $scope.isLoggedIn = Auth.isLoggedIn();
  $scope.errors = {};
  $scope.submitted = false;

  $scope.disableorder = true;
  $scope.disablepayment = true;
  $scope.address = {};
  $scope.amounttobepaid = 0;
  $scope.grandtotal = 0;
  $scope.voucheramount = 0;

  $scope.enableVoucher = true;

  var q = { where: { email: Auth.getCurrentUser().email } };

  $scope.myTabIndex = 0;

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  $scope.displaycarItems = function () {
    Cart.show({ id: Auth.getCurrentUser()._id }, function (res) {
      $scope.carts = res;
      $scope.appliedVoucher = res.vouchers;
      console.log($scope.appliedVoucher);
      if ($scope.appliedVoucher || $scope.appliedVoucher != null) {
        $scope.enableVoucher = false;
      }
      $scope.items = res.items;
      $scope.subtotal = 0;
      for (var i = 0; i < $scope.items.length; i++) {
        $scope.subtotal += $scope.items[i].subtotal;
        if ($scope.appliedVoucher || $scope.appliedVoucher != null) {
          $scope.grandtotal = $scope.subtotal;
          $scope.voucheramount = $scope.appliedVoucher.amount;
          $scope.amounttobepaid = $scope.subtotal - $scope.appliedVoucher.amount;
        } else {
          $scope.grandtotal = $scope.subtotal;
          $scope.amounttobepaid = $scope.subtotal;
        }
      }
    });
  };

  $scope.displaycarItems();
  console.log("tabindex");

  console.log($scope.myTabIndex);
  /* $scope.vouchers =  Voucher.query(q);
   console.log($scope.vouchers)
  
    */

  $scope.redeemvoucher = function (voucherCode) {
    $scope.errormessage = '';
    $scope.voucher = {};
    $scope.voucher.code = voucherCode;
    $scope.voucher.amount = $scope.subtotal;
    $scope.voucher.user = Auth.getCurrentUser()._id;
    console.log($scope.voucher);
    Voucher.redeem($scope.voucher, function (resp) {
      console.log(resp);
      $scope.displaycarItems();
      if (resp.errorcode == 0) {
        $scope.errormessage = "Sorry, Voucher already redeemed";
      } else if (resp.errorcode == 1) {
        $scope.errormessage = "Sorry, Voucher validity expired";
      } else if (resp.errorcode == 2) {
        $scope.errormessage = "Sorry, Voucher amount is greater than cart amount";
      } else if (resp.errorcode == 3) {
        $scope.errormessage = "Sorry, Invalid voucher code";
      } else if (resp.errorcode == 4) {
        $scope.errormessage = "Sorry, Voucher already applied to cart";
      }
    });
  };

  $scope.items = Cart.show({ id: Auth.getCurrentUser()._id }, function (res) {
    console.log(res);
    $scope.items = res.items;
    console.log($scope.items);
  });

  $scope.moveprev = function () {
    $scope.myTabIndex = 0;
  };

  $scope.moveNext = function () {
    $scope.myTabIndex = $scope.myTabIndex + 1;
    $scope.showshipping = true;
  };

  $scope.gotoshipping = function () {
    console.log("inside shipping");
    $scope.myTabIndex = 0;
  };

  $scope.showshipping = false;

  $scope.states = stateService.getstates();

  /*
    $scope.savelocationmyTabIndex = function(form){
      $scope.locationformsubmmyTabIndexitted = false;
      if (!form.$valid) {
        $scope.locationformsubmitted = true
      }else{
        $scope.disablemessage = false;
        $state.go('createregistry.message');
      }
  
    }*/
  /*
    $scope.redeemVoucher = function(voucher1){
      var data = {code:voucher1};
      Voucher.redeem(data, function(resp) {
  
      }, function(err) {
        console.log(err)
      })
  
    }*/

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

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  /*
    $scope.checkout = (cart, user) => {
  
  
      if (user.name && user.email && user.phone && user.address && user.city && user.country) {
        _.map(cart.items, i => {
          i.productId = i.id;
          delete i.data;
          delete i.id;
          return i;
        })
  
        cart = _.extend(cart, {
          customerId: user._id ? user._id : '',
          customerName: user.name,
          customerEmail: $scope.user.email,
          customerAddress: user.address,
          customerAddress1: user.address1,
          customerlandmark : user.landmark,
          customerPhone: user.phone,
          customerCity: user.city,
          customerState: user.state ? user.state : '',
          customerCountry: 'India'
        });
  
        Order.save(cart,
          function(resp) {
            ngCart.empty();
            $state.go('invoice', {id: resp._id});
          },
          function(err) {
            toaster.pop('error', "Please Try again later");
          });
      } else {
        $scope.message = 'Please, complete the shipping section and click on continue'
      }
    }*/

  $scope.completeOrder = function (cart, user) {
    $scope.cart = {};
    $scope.cart.items = cart;
    if ($scope.carts.vouchers) {
      $scope.cart.vouchers = $scope.carts.vouchers._id;
      $scope.cart.paidbyVoucher = $scope.carts.vouchers.amount;
    }
    $scope.cart.paid = paid;
    $scope.cart.status = 'placed';

    Address.save($scope.address, function (resp) {
      console.log(resp);
      $scope.cart.customerId = user._id ? user._id : '', $scope.cart.customerName = user.name, $scope.cart.customerEmail = $scope.user.email, $scope.cart.customerAddress = resp._id;
      console.log(cart);
      $scope.cart.totalCost = 0;
      for (var i = 0; i < $scope.cart.items.length; i++) {
        $scope.cart.totalCost += parseInt($scope.cart.items[i].subtotal);
        $scope.cart.items[i].statusChangeHistory = [];
        $scope.cart.items[i].status = 'placed';
        $scope.cart.items[i].statusChangeHistory.push({ status: 'placed' });
      }
      $scope.cart.status = 'placed';
      console.log($scope.cart);

      Order.save($scope.cart, function (resp) {
        Cart['delete']({ id: Auth.getCurrentUser()._id });
        $state.go('orders');
      }, function (err) {
        toaster.pop('error', "Please Try again later");
      });
    }, function (err) {
      console.log(err);
    });
  };

  $scope.presubmit = function () {
    var data = { preHashString: $scope.mkey + '|' + $scope.txnid + '|' + $scope.amount + '|' + $scope.productInfo + '|' + $scope.firstName + '|' + $scope.email + '|' + $scope.id + '||||||||||' };
    Payment.createHash(data, function (resp) {
      document.getElementById('hash').value = resp.hash;
      document.getElementById('paymentForm').submit();
    }, function (err) {
      console.log(err);
    });
  };

  $scope.message = 'Get ready to buy gift card';
  $scope.mkey = 'gtKFFx';
  $scope.productInfo = 'AddVoucher';
  $scope.txnid = makeid();
  $scope.id = uuidv4();
  $scope.type = '2';
  $scope.email = Auth.getCurrentUser().email;
  $scope.phone = 9176464641;
  $scope.lastName = Auth.getCurrentUser().name;
  $scope.firstName = '';
  $scope.surl = window.location.origin + "/api/payment/pdtPaymentStatus";
  $scope.furl = window.location.origin + "/api/payment/pdtPaymentFailureStatus";
  $scope.hash = '';

  $scope.paymentpage = function () {
    $scope.myTabIndex = $scope.myTabIndex + 1;
  };

  $scope.checkoutorder = function (cart, user) {

    $scope.cart = {};
    $scope.cart.items = cart;
    if ($scope.carts.vouchers) {
      $scope.cart.vouchers = $scope.carts.vouchers._id;
      $scope.cart.paidbyVoucher = $scope.carts.vouchers.amount;
    }
    Address.save($scope.address, function (resp) {
      console.log(resp);
      $scope.cart.customerId = user._id ? user._id : '', $scope.cart.customerName = user.name, $scope.cart.customerEmail = $scope.user.email, $scope.cart.address = resp._id;
      console.log(cart);
      $scope.cart.totalCost = 0;
      for (var i = 0; i < $scope.cart.items.length; i++) {
        $scope.cart.totalCost += parseInt($scope.cart.items[i].subtotal);
        $scope.cart.items[i].statusChangeHistory = [];
        $scope.cart.items[i].status = 'placed';
        $scope.cart.items[i].statusChangeHistory.push({ status: 'placed' });
      }
      $scope.cart.status = 'placed';
      console.log($scope.cart.totalCost);

      Order.save($scope.cart, function (resp) {
        $scope.amount = resp.totalCost;
        $scope.productInfo = resp._id;
        $scope.presubmit();
        $scope.myTabIndex = $scope.myTabIndex + 1;
      }, function (err) {
        toaster.pop('error', "Please Try again later");
      });
    }, function (err) {
      console.log(err);
    });
  };
}]);
//# sourceMappingURL=checkout.controller.js.map
