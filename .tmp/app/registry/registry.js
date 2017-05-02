'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
  $stateProvider.state('createregistry', {
    url: '/create-registry',
    templateUrl: 'app/registry/create-registry.html',
    controller: 'CreateRegistryController',
    controllerAs: 'registry',
    params: {
      type: null
    }
  }).state('manageregistry', {
    url: '/manage-registry/{id}',
    templateUrl: 'app/registry/manage-registry.html',
    controller: 'ManageRegistryController'
  }).state('manageregistryList', {
    url: '/manage-registry-list',
    templateUrl: 'app/registry/manage-registry-list.html',
    controller: 'ManageRegistryListController'
  }).state('registry', {
    url: '/registry/{id}',
    templateUrl: 'app/registry/registry.html',
    controller: 'RegistryController'
  }).state('findregistry', {
    url: '/find-registry',
    templateUrl: 'app/registry/find-registry.html',
    controller: 'FindRegistryController'
  });
});
//# sourceMappingURL=registry.js.map
