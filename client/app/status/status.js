'use strict';

angular.module('bhcmartApp')
.config(function ($stateProvider) {
  $stateProvider
  .state('successstatus', {
    url: '/successstatus/{status}',
    templateUrl: 'app/status/payemntsuccess.html',
    controller: 'statusCtrl'
  })      
  .state('successstatusc', {
    url: '/successstatusc/{status}/{param}',
    templateUrl: 'app/status/payemntsuccess.html',
    controller: 'statusCtrl'
  })      
  .state('failurestatus', {
    url: '/failurestatus/{status}/{param}',
    templateUrl: 'app/status/payemntFailure.html',
    controller: 'statusCtrl'
  });
});
