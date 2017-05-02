'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'app/home/home.html',
    controller: 'HomeController',
    controllerAs: 'home'
  });
});
//# sourceMappingURL=home.js.map
