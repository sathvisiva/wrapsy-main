'use strict';

angular.module('bhcmartApp').factory('Order', function ($resource) {
  return $resource('/api/orders/:id/:controller', {
    id: '@_id'
  }, {
    'update': { method: 'PUT' },
    'myOrders': {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'myorders'
      }
    },
    'updateCancel': {
      method: 'POST',

      params: {
        controller: 'updateCancel'
      }
    }
  });
});
//# sourceMappingURL=order.service.js.map
