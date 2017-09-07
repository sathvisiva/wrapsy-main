'use strict';

angular.module('bhcmartApp')
.controller('VoucherCtrl', function ($scope,$mdDialog,$mdMedia,Auth,Voucher,$http,Payment) {

	this.getCurrentUser = Auth.getCurrentUser;

	console.log(this.getCurrentUser());


	function makeid() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}


	function uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	$scope.message = 'Everyone come and see how good I look!';
	$scope.mkey = 'gtKFFx';
	$scope.productInfo = 'AddVoucher';
	$scope.txnid = makeid();
	$scope.id = uuidv4();
	$scope.type = '2';
	$scope.email = 'sathvisiva@gmail.com';
	$scope.phone = 9176464641;
	$scope.lastName = this.getCurrentUser().name;
	$scope.firstName = '';
	$scope.surl = "http://localhost:9000/PaymentStatus";
	$scope.hash = '';

	$scope.presubmit = function () {
		var data = { preHashString: $scope.mkey + '|' + $scope.txnid + '|' + $scope.amount + '|' + $scope.productInfo + '|' + $scope.firstName + '|' + $scope.email + '|' + $scope.id + '||||||||||' };
		Payment.createHash(data, function(resp) {
			document.getElementById('hash').value = resp.hash;
			document.getElementById('paymentForm').submit();
		}, function(err) {
			console.log(err)
		})
	}


	$scope.savevoucher = function(ev,form){
		console.log("inside voucher")
		$scope.voucherFormSubmitted = false;
		if (!form.$valid) {
			$scope.voucherFormSubmitted = true
		}else{
			if($scope.isLoggedIn()){
				console.log($scope.voucher);
				$scope.user = Auth.getCurrentUser() || {};
				$scope.voucher.validuntil = new Date();
				$scope.voucher.validuntil.setYear($scope.voucher.validuntil.getFullYear() + 1);
				$scope.voucher.email = $scope.user.email;
				console.log($scope.voucher);
				Voucher.save($scope.voucher, function(resp) {
					$scope.amount = resp.amount;
					$scope.productInfo = resp._id;
					$scope.presubmit()
				}, function(err) {
					console.log(err)
				})
			}else{
				$scope.data = {'event' : 'login'};
				$scope.login(ev, $scope.data);
			}
		}
	}

	$scope.login = function(ev,data) {
		$mdDialog.show({
			controller: 'LoginController'
			, templateUrl: 'app/account/login/login.html'
			, parent: angular.element(document.body)
			, targetEvent: ev

			, clickOutsideToClose: true
			, locals: {
				dataToPass: data
			}
		});

		$scope.$watch(function () {
			return $mdMedia('xs') || $mdMedia('sm');
		}, function (wantsFullScreen) {
			$scope.customFullscreen = (wantsFullScreen === true);
		});
	}


	$scope.redeemVoucher = function(){
		var q = {where:{code:$scope.code}};

		Voucher.redeem(q, function(resp){
			console.log(resp);
		});
	}
});



angular.module('bhcmartApp')
.controller('VoucherListCtrl', function ($scope,$mdDialog,$mdMedia,Auth,Voucher,$http,Payment) {

	this.getCurrentUser = Auth.getCurrentUser;
	console.log(this.getCurrentUser());

	var q = {where:{email:Auth.getCurrentUser().email, paid : true }};
	$scope.vouchers =  Voucher.query(q);
	console.log($scope.vouchers)

	
});
angular.module('bhcmartApp')
.controller('VoucherRedeemCtrl',function ($scope,$rootScope,$state, $stateParams,Registry,Auth,$location, $uibModalInstance, Voucher,amount) {


	$scope.cancel = function () {
		$uibModalInstance.dismiss('Close');
	};
	$scope.ok = function () {
		$scope.errormessage = '';
		$scope.voucher = {};
		$scope.voucher.code = $scope.voucherCode;
		$scope.voucher.amount = amount;
		Voucher.redeem($scope.voucher, function(resp){
			if(resp.errorcode == 0 ){
				$scope.errormessage = "Sorry, Voucher already redeemed";
			}else if(resp.errorcode == 1){
				$scope.errormessage = "Sorry, Voucher validity expired";
			}else if(resp.errorcode == 2){
				$scope.errormessage = "Sorry, Voucher amount is greater than cart amount";
			}else if(resp.errorcode == 3){
				$scope.errormessage = "Sorry, Invalid voucher code";
			}
			else{
				/*console.log(resp);
				$scope.voucher.code = resp.code;
				$scope.voucher.amount = resp.amount;
				$scope.voucher.id _ resp._id*/

				$uibModalInstance.close(resp);	
			}
		});
		
	};

});
