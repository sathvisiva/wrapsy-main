'use strict';

angular.module('bhcmartApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('manage-categories', {
        url: '/manage-categories',
        templateUrl: 'app/manage-categories/manage-categories.html',
        controller: 'ManageCategoriesCtrl'
      })
      .state('edit-category', {
        url: '/manage-categories/{id}',
        templateUrl: 'app/manage-categories/manage-categories-edit.html',
        controller: 'ManageCategoriesEditCtrl'
      })
      .state('add-category', {
        url: '/add-category',
        templateUrl: 'app/manage-categories/manage-categories-add.html',
        controller: 'ManageCategoriesAddCtrl'
      })
      .state('manage-features', {
        url: '/manage-categories',
        templateUrl: 'app/manage-categories/manage-features.html',
        controller: 'ManageCategoriesCtrl'
      })
      .state('edit-features', {
        url: '/manage-categories/{id}',
        templateUrl: 'app/manage-categories/manage-features-edit.html',
        controller: 'ManageCategoriesEditCtrl'
      })
      .state('add-features', {
        url: '/add-category',
        templateUrl: 'app/manage-categories/manage-features-add.html',
        controller: 'ManageCategoriesAddCtrl'
      });
  });
