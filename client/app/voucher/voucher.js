'use strict';

angular.module('bhcmartApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('gift-card', {
        url: '/gift-card',
        templateUrl: 'app/voucher/voucher.html',
        controller: 'VoucherCtrl'
      })
      .state('myvouchers', {
        url: '/myvouchers',
        templateUrl: 'app/voucher/voucherslist.html',
        controller: 'VoucherListCtrl'
      });


  });
