'use strict';

angular.module('bhcmartApp')
.controller('CheckoutCtrl', ['$scope', 'Auth', '$state', 'Order', 'ngCart','toaster','Voucher','Address','Payment','$uibModal', 'stateService',function($scope, Auth, $state, Order, ngCart, toaster,Voucher,Address,Payment, $uibModal, stateService) {
  $state.go('checkout.shipping')
  $scope.user = Auth.getCurrentUser() || {};
  $scope.user.country = "In"

  $scope.isLoggedIn = Auth.isLoggedIn();
  $scope.errors = {};
  $scope.submitted = false;

  $scope.disableorder = true ; 
  $scope.disablepayment = true;
  $scope.address = {};

  var q = {where:{email:Auth.getCurrentUser().email}};

  $scope.myTabIndex = 0;
  console.log("tabindex");

  console.log($scope.myTabIndex);
 /* $scope.vouchers =  Voucher.query(q);
  console.log($scope.vouchers)


  */

  $scope.moveprev = function(){
   $scope.myTabIndex = 0; 
   
 }


 $scope.addVoucher = function(ev){
  if($scope.isLoggedIn()){
   var modalInstance = $uibModal.open({
    templateUrl : 'app/voucher/redeem-voucher.html',
    controller: 'VoucherRedeemCtrl',
    size :'md',
    resolve: {
      amount: function () {
       return ngCart.totalCost();
     }
   }
 })
   .result.then(function(result) {
    console.log(result);
    console.log($scope.productInfo);


    Order.updateVoucher({id:$scope.productInfo},result).$promise.then(function(res) {
     console.log(res.ok);
   });


  /*  Order.countorders(q, function (orders) {
      $scope.orderscount = orders[0].count;
      console.log($scope.orderscount);
    });*/
  }, function() {
  // Cancel
});
 }else{
  $scope.data = {'event' : 'login'};
  $scope.login(ev, $scope.data);

}
}

$scope.moveNext = function(){
 $scope.myTabIndex = $scope.myTabIndex + 1; 
 $scope.showshipping = true;
}

$scope.gotoshipping = function(){
  console.log("inside shipping")
  $scope.myTabIndex = 0;
}

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

  $scope.redeemVoucher = function(voucher1){
    var data = {code:voucher1};
    Voucher.redeem(data, function(resp) {

    }, function(err) {
      console.log(err)
    })

  }


  $scope.validate = form => {
    if(!$scope.isLoggedIn){
      toaster.pop('error', "Please login to continue");
    }      
    console.log("state" + $scope.user.state)
    if (form.$valid && ( $scope.user.state || $scope.user.state != "")) {
      $scope.message = '';
      $scope.submitted = true;
    }else{
      toaster.pop('error', "Please check the data entered");
    }
  }


  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

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

  $scope.presubmit = function () {
    var data = { preHashString: $scope.mkey + '|' + $scope.txnid + '|' + $scope.amount + '|' + $scope.productInfo + '|' + $scope.firstName + '|' + $scope.email + '|' + $scope.id + '||||||||||' };
    Payment.createHash(data, function(resp) {
      document.getElementById('hash').value = resp.hash;
      document.getElementById('paymentForm').submit();
    }, function(err) {
      console.log(err)
    })
  }

  $scope.message = 'Everyone come and see how good I look!';
  $scope.mkey = 'gtKFFx';
  $scope.productInfo = 'Verification order';
  $scope.txnid = makeid();
  $scope.amount = 234.99;
  $scope.id = '2222222';
  $scope.type = '2';
  $scope.email = 'sathvisiva@gmail.com';
  $scope.phone = 9176464641;
  $scope.lastName = 'test';
  $scope.firstName = 'fname';
  $scope.surl = "http://localhost:9000/PaymentStatus";
  $scope.hash = '';

  $scope.checkoutorder = function(cart, user){

    if (user.name && user.email ) {
      _.map(cart.items, i => {
        i.productId = i.id;
        delete i.data;
        delete i.id;
        return i;
      })

      Address.save($scope.address, function(resp) {
        cart = _.extend(cart, {
          customerId: user._id ? user._id : '',
          customerName: user.name,
          customerEmail: $scope.user.email,
          customerAddress: user.address
        });
        console.log(cart)
        Order.save(cart,function(resp) {
          $scope.amount = resp.totalCost;
          $scope.productInfo = resp._id;
          $scope.presubmit();
          $scope.myTabIndex = $scope.myTabIndex + 1; 
          //ngCart.empty();

        },
        function(err) {
          toaster.pop('error', "Please Try again later");
        });

      }, function(err) {
        console.log(err)
      });

    } else {
      $scope.message = 'Please, complete the shipping section and click on continue'
    }

  }
}]);
