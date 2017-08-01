'use strict';

angular.module('bhcmartApp').config(function ($stateProvider) {
	$stateProvider.state('admin-console', {
		url: '/admin-console',
		templateUrl: 'app/admin-console/admin.html',
		controller: 'AdminCtrl'
	}).state('admin-console.orders', {
		url: '/orders',
		templateUrl: 'app/admin-console/orders.html'
	});
});
//# sourceMappingURL=admin.js.map
