'use strict';

angular.module('bhcmartApp')
.config(function ($stateProvider) {
	$stateProvider
	.state('adminconsole', {
		url: '/admin-console',
		templateUrl: 'app/admin-console/admin.html',
		controller: 'AdminCtrl',
		authenticate: 'admin',
		authenticate: 'admin'
	})
	.state('adminconsole.dashboard', {
		url: '/dashboard',
		templateUrl: 'app/admin-console/dashboard.html'
	})
	.state('adminconsole.orders', {
		url: '/orders',
		templateUrl: 'app/admin-console/orders.html'
	})
	.state('adminconsole.addfeature', {
		url: '/add-feature',
		templateUrl: 'app/manage-features/manage-features-add.html',
		controller : 'ManageFeaturesAddCtrl'
	})
	.state('adminconsole.featureslist', {
		url: '/features',
		templateUrl: 'app/manage-features/manage-features.html',
		controller : 'ManageFeaturesCtrl'
	})
	.state('adminconsole.featuredProducts', {
		url: '/featuredProducts',
		templateUrl: 'app/admin-console/featured-products.html',
		controller : 'FeaturedProductsCtrl'
	})
	.state('adminconsole.pdtlist', {
		url: '/products',
		templateUrl: 'app/manage-products/manage-products.html',
		controller : 'ManageProductsCtrl'
	})
	.state('adminconsole.addproduct', {
		url: '/add-product',
		templateUrl: 'app/manage-products/manage-products-add.html',
		controller: 'ManageProductsAddCtrl',
		resolve: {
			categories: ['Catalog', function(Catalog) {
				return Catalog.query();
			}]
		}
	})
	.state('adminconsole.edit-product', {
		url: '/manage-product/{id}',
		templateUrl: 'app/manage-products/manage-products-edit.html',
		controller: 'ManageProductsEditCtrl',
	})
	.state('adminconsole.manage-categories', {
		url: '/manage-categories',
		templateUrl: 'app/manage-categories/manage-categories.html',
		controller: 'ManageCategoriesCtrl'
	})
	.state('adminconsole.edit-category', {
		url: '/manage-categories/{id}',
		templateUrl: 'app/manage-categories/manage-categories-edit.html',
		controller: 'ManageCategoriesEditCtrl'
	})
	.state('adminconsole.add-category', {
		url: '/add-category',
		templateUrl: 'app/manage-categories/manage-categories-add.html',
		controller: 'ManageCategoriesAddCtrl'
	})
	.state('adminconsole.manage-home-image', {
		url: '/manage-home-image',
		templateUrl: 'app/manage-home/manage-home-image.html',
		controller: 'ManageHomePageCtrl'
	})
	.state('adminconsole.add-home-image', {
		url: '/add-home-image',
		templateUrl: 'app/manage-home/add-home-image.html',
		controller: 'ManageHomePageImgAddCtrl'
	})
	.state('adminconsole.add-popularCategory-image', {
		url: '/add-popcategory',
		templateUrl: 'app/manage-home/add-popcategory.html',
		controller: 'ManagePopularCategoriesAddCtrl'
	})
});
