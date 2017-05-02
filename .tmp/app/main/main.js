'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/shop',
    templateUrl: 'app/main/main.html',
    controller: 'MainController',
    controllerAs: 'main',
    params: {
      registryId: null,
      registryTitle: null
    }
  });
});
//# sourceMappingURL=main.js.map
