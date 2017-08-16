'use strict';

angular.module('bhcmartApp')
.controller('FeaturedProductsCtrl', ['$scope', 'Product', 'Modal',
  function($scope, Product, Modal) {

    Product.query(function(products){
      console.log(products)
      $scope.products = products;
      $scope.currentPage = 1;
      $scope.totalItems = $scope.products.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);

      })


    $scope.addtoFeaturedProducts = function(id,p){
      console.log(id);
      Product.addfeaturedPdt({id:id},p).$promise.then(function(products) {
        $scope.products = products;
        $scope.currentPage = 1;
        $scope.totalItems = $scope.products.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });


    }

    $scope.removefromFeaturedProducts = function(id,p){
      console.log(id);
      Product.removefeaturedPdt({id:id},p).$promise.then(function(products) {
        $scope.products = products;
        $scope.currentPage = 1;
        $scope.totalItems = $scope.products.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });


    }

 /*     Product.query(function(products) {
        $scope.products = products;
        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.products.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });*/

      $scope.deleteFeature = Modal.confirm.delete(function(f) {
        Product.destroyFeature({id:f._id},f).$promise.then(function(res) {
          console.log(res)
          $scope.features.splice($scope.features.indexOf(f), 1);
        });

      /*  f.$remove(f._id, function(resp) {
          console.log(resp)
          
        })*/
      });
    }
    ])
.controller('AdminCtrl', function($scope,Auth, Modal, ngCart, $state,$mdDialog,Order, Product, Catalog, User, $mdSidenav) {

 $scope.isLoggedIn = Auth.isLoggedIn;
 $scope.isAdmin = Auth.isAdmin;
 $scope.getCurrentUser = Auth.getCurrentUser;

 

 /*$scope.registry._id = $stateParams.id*/

 $scope.adminPage = function(state){
  $scope.state = 'adminconsole.'+state;
  $state.go($scope.state);
}


var q= {};
q.where = {};
var f =[];
f.push({'created' : { $gte: moment().startOf('week').toDate() }});
q.where = {f};

$scope.filter = {};
$scope.filter.startday = moment().startOf('week').toDate();
$scope.filter.endOfWeek = moment().endOf('week').toDate();
console.log($scope.filter);

Order.countorders(q,function(orders) {
  $scope.orderscount = orders[0].count;
  console.log($scope.orderscount);
});

Product.productCount(function(product) {
  $scope.productCount = product[0].count;  
});

Catalog.catalogCount(function(catalog) {
  $scope.catalogCount = catalog[0].count;  
});

User.userCount(function(user) {
  $scope.userCount = user[0].count;  
});

$scope.features = Product.indexFeatures();
console.log($scope.features.length)






$scope.orderstatus = [
{id : 1, status : "Processed"},
{id : 2, status : "Complete"},
{id : 3, status : "Open"},
{id : 3, status : "Canceled"}
];

$scope.viewOrders = function() {
  Order.query(function(orders) {
    $scope.orders = orders;
        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.orders.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });
  console.log($scope.orders);
  $state.go('admin-console.orders');

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

$scope.checkout = function(ev){
  if($scope.isLoggedIn()){
   $state.go('checkout');
 }else{
   $scope.data = {'state' : 'checkout' , 'event' : 'login'};
   $scope.login(ev, $scope.data);
 }
}

});
