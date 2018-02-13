'use strict';

angular.module('bhcmartApp')
.controller('statusCtrl', function ($scope , $state , $stateParams , $timeout,$location) {
	$timeout(function() {
		console.log($stateParams.param);
		if($stateParams.param){
			/*$state.go($stateParams.status , {id:$stateParams.param });*/
			$location.path('/registry/'+$stateParams.param+'/' )
		}
		else{
			$state.go($stateParams.status);
		}
	}, 3000);
});
