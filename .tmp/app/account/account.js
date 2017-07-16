'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
  $stateProvider.state('logout', {
    url: '/logout?referrer',
    referrer: 'main',
    template: '',
    controller: function controller($state, Auth) {
      var referrer = $state.params.referrer || $state.current.referrer || 'main';

      Auth.logout();
      $state.go('home');
    }
  }).state('forgotPassword', {
    url: '/forgotPassword',
    templateUrl: 'app/account/forgot/forgotpassword.html',
    controller: 'ForgotPasswordController'

  }).state('settings', {
    url: '/reset/{token}',
    templateUrl: 'app/account/forgot/resetpassword.html',
    controller: 'ForgotPasswordController'
  });
}).run(function ($rootScope) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
    if (next.name === 'logout' && current && current.name && !current.authenticate) {
      next.referrer = current.name;
    }
  });
});
//# sourceMappingURL=account.js.map
