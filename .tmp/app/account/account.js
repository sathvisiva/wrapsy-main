'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'app/account/login/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  }).state('logout', {
    url: '/logout?referrer',
    referrer: 'main',
    template: '',
    controller: function controller($state, Auth) {
      var referrer = $state.params.referrer || $state.current.referrer || 'main';

      Auth.logout();
      console.log("account.js");
      $state.go('home');
    }
  }).state('signup', {
    url: '/signup',
    templateUrl: 'app/account/signup/signup.html',
    controller: 'SignupController',
    controllerAs: 'vm'
  }).state('settings', {
    url: '/settings',
    templateUrl: 'app/account/settings/settings.html',
    controller: 'SettingsController',
    controllerAs: 'vm'

  });
}).run(function ($rootScope) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
    if (next.name === 'logout' && current && current.name && !current.authenticate) {
      next.referrer = current.name;
    }
  });
});
//# sourceMappingURL=account.js.map
