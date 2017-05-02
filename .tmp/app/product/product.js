'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
  $stateProvider.state('product', {
    url: '/product/{id}',
    templateUrl: 'app/product/product.html',
    controller: 'ProductCtrl',
    params: {
      registryId: null,
      registryTitle: null
    }
  });
});
//# sourceMappingURL=product.js.map
