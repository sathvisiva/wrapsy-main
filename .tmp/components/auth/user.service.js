'use strict';

(function () {

  function UserResource($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      forgotPassword: {
        method: 'POST',
        params: {
          controller: 'forgot'
        }
      },
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      'userCount': {
        method: 'post',
        isArray: true,
        params: {
          controller: 'userCount'
        }
      }
    });
  }

  angular.module('bhcmartApp.auth').factory('User', UserResource);
})();
//# sourceMappingURL=user.service.js.map
