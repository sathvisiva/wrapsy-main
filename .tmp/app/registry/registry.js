'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
  $stateProvider.state('createregistry', {
    url: '/create',
    templateUrl: 'app/registry/create-registry.html',
    controller: 'CreateRegistryController'
  }).state('createregistry.registryType', {
    url: '/registryType',
    templateUrl: 'app/registry/registry-type.html'
  }).state('createregistry.eventDetails', {
    url: '/eventDetails',
    templateUrl: 'app/registry/event-details.html'
  }).state('createregistry.location', {
    url: '/location',
    templateUrl: 'app/registry/location.html'
  }).state('createregistry.message', {
    url: '/message',
    templateUrl: 'app/registry/message.html'
  }).state('manageregistry', {
    url: '/manage-registry/{id}',
    templateUrl: 'app/registry/manage-registry.html',
    controller: 'ManageRegistryController'
  }).state('manageregistryList', {
    url: '/manage-registry-list',
    templateUrl: 'app/registry/themeregistry.html',
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
