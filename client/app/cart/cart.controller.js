'use strict';

angular.module('bhcmartApp')
.controller('CartCtrl', function($scope, Modal, ngCart, $state,$mdDialog,Voucher,$uibModal) {



 $scope.clearCart = function(ev) {
  var confirm = $mdDialog.confirm()
  .title('Confirm')
  .textContent('Would you like to remove all the items from your cart' )
  .ariaLabel('remove product')
  .targetEvent(ev)
  .ok('Please do it!')
  .cancel('cancel');

  $mdDialog.show(confirm).then(function() {
   ngCart.empty()
 }, function() {

 });

}

$scope.calculateGST = function(gst,qty,amt){
 return (parseInt(gst)*parseInt(qty)*parseInt(amt))/100;
};

$scope.addVoucher = function(){
 var modalInstance = $uibModal.open({
  templateUrl : 'app/voucher/redeem-voucher.html',
  controller: 'VoucherRedeemCtrl',
  size :'md',
  resolve: {
    amount: function () {
     return ngCart.totalCost();
   }
 }
})
 .result.then(function(result) {
  console.log(result)
}, function() {
  // Cancel
});
}

$scope.removeProduct = function(ev,productName , product) {
  var confirm = $mdDialog.confirm()
  .title('Confirm')
  .textContent('Would you like to remove' + productName + 'from your cart' )
  .ariaLabel('remove product')
  .targetEvent(ev)
  .ok('Please do it!')
  .cancel('cancel');

  $mdDialog.show(confirm).then(function() {
   ngCart.removeItemById(product.getId());
 }, function() {

 });

}



/*ui-sref="checkout"*/

$scope.checkout = function(ev){
  if($scope.isLoggedIn()){
    console.log(ngCart.getVouchers());
    /*if(ngCart.getVouchers().length == 0 ){
      ngCart.addVoucher('null');
    }*/

    $state.go('checkout');
  }else{
   $scope.data = {'state' : 'checkout' , 'event' : 'login'};
   $scope.login(ev, $scope.data);
 }
}

});
