'use strict';

angular.module('bhcmartApp').controller('CartCtrl', function ($scope, Modal, ngCart, $state) {
	$scope.clearCart = Modal.confirm['delete'](function () {
		ngCart.empty();
	});

	$scope.removeProduct = Modal.confirm.remove(function (o) {
		ngCart.removeItemById(o.getId());
	});

	/*ui-sref="checkout"*/

	$scope.checkout = function (ev) {
		if ($scope.isLoggedIn()) {
			$state.go('checkout');
		} else {
			$scope.data = { 'state': 'checkout', 'event': 'login' };
			$scope.login(ev, $scope.data);
		}
	};
});
//# sourceMappingURL=cart.controller.js.map
