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
    'countorders': {
      method: 'POST',
      isArray: true,
      params: {
        controller: 'countorders'
      }
    },
    'updateCancel': {
      method: 'POST',
      params: {
        controller: 'updateCancel'
      }
    },
    'countorder': {
      method: 'GET',
      params: {
        controller: 'countorder'
      }
    },
    //updateVoucher
    'updateVoucher': {
      method: 'POST',
      params: {
        controller: 'updateVoucher'
      }
    }

  });
});
//# sourceMappingURL=order.service.js.map
