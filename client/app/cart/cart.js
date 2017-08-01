'use strict';

angular.module('bhcmartApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cart-details', {
        url: '/cart',
        templateUrl: 'app/cart/cart.html',
        controller: 'CartCtrl'
      });
  });
