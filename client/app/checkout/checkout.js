'use strict';

angular.module('bhcmartApp')
.config(function ($stateProvider) {
	$stateProvider
	.state('checkout', {
		url: '/checkout',
		templateUrl: 'app/checkout/checkout.html',
		controller: 'CheckoutCtrl'
	})
	.state('checkout.shipping', {
		url: '/shipping',
		templateUrl: 'app/checkout/shipping.html'
	})
	.state('checkout.orderreview', {
		url: '/orderreview',
		templateUrl: 'app/registry/event-details.html'
	})
	.state('checkout.payment', {
		url: '/payment',
		templateUrl: 'app/checkout/checkout.html',
		controller: 'CheckoutCtrl'
	});
});
