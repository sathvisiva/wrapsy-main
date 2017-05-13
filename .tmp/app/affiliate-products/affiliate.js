'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
  $stateProvider.state('affiliate', {
    url: '/other-products',
    templateUrl: 'app/affiliate-products/affiliate.html',
    controller: 'AffiliateController'

  });
});
//# sourceMappingURL=affiliate.js.map
