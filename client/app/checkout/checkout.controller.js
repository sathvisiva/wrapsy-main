'use strict';

angular.module('bhcmartApp')
  .controller('CheckoutCtrl', ['$scope', 'Auth', '$state', 'Order', 'ngCart','toaster', function($scope, Auth, $state, Order, ngCart, toaster) {

    $scope.user = Auth.getCurrentUser() || {};
    $scope.user.country = "In"
    
    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.errors = {};
    $scope.submitted = false;
    
    $scope.states = [
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



    $scope.login = (form) => {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
            email: $scope.user.email,
            password: $scope.user.password
          })
          .then(() => {
            $state.reload();
          })
          .catch(err => {
            $scope.errors.other = err.message;
          });
      }
    }

    $scope.validate = form => {
      if(!$scope.isLoggedIn){
        toaster.pop('error', "Please login to continue");
      }      
      if (form.$valid && ( $scope.user.state || $scope.user.state != "")) {
        $scope.message = '';
        $scope.submitted = true;
      }else{
        toaster.pop('error', "Please check the data entered");
      }
    }


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
          customerEmail: user.email,
          customerAddress: user.address,
          customerPhone: user.phone,
          customerCity: user.city,
          customerState: user.state ? user.state : '',
          customerCountry: user.country
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
    }
  }]);
