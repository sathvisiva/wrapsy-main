'use strict';

angular.module('bhcmartApp')
.controller('ProductCtrl', ['$scope', '$stateParams', '$state', 'Product', 'Registry','$rootScope','ngCart','Auth','toaster','$mdDialog','$timeout',
  function($scope, $stateParams, $state, Product, Registry, $rootScope, ngCart,Auth, toaster,$mdDialog, $timeout) {

      //Get product and fetch related products based on category
      $scope.product = Product.get({ id: $stateParams.id }, function(p) {
        if(p.color){
          $scope.colors = p.color;
          $scope.product.color = $scope.colors[0];
        }
        if(p.size){
          $scope.sizes = p.size;
          $scope.product.size =  $scope.sizes[0];
        }

        $scope.qty = 1;
        $scope.product.averageRating = getAverageRating(p);
        Product.catalog({ id: p.categories[0].slug }, function(relatedProducts) {
          $scope.relatedProducts = _.filter(
            _.map(relatedProducts, relatedProduct =>
              _.extend(relatedProduct, { averageRating: getAverageRating(relatedProduct) })), rp => rp._id != p._id);
        });
      });

      if(Auth.isLoggedIn()){
        var q = {where:{username:Auth.getCurrentUser().email}};
        $scope.registryOptions =  Registry.query(q);
      }

      $scope.registry = {}
      $scope.registry.registryId = ""

      $scope.addtoRegistry = function(ev,product, qty,registryId){

        $scope.message = '';


        if(!Auth.isLoggedIn()){
          $scope.message = "Please login to add Registry";
        }else if($scope.registryOptions && $scope.registryOptions.length <1){
          $scope.message = "No Registry found. Please create Registry";
        }else if(!registryId){
          $scope.message = "Please choose a Registry";
        }else if($scope.registry.registryId){

          $scope.multiple = false;

          if(product.price > 5000 && !product.affiliate){
           var confirm = $mdDialog.confirm()
           .textContent('Would you like to wishlist this item as a solo item or put it under a chip-in category so that multiple guests can chip- in towards it?')
           .ariaLabel('solo or multichipin')
           .targetEvent(ev)
           .ok('Chip In')
           .cancel('Solo');

           $mdDialog.show(confirm).then(function() {
            $scope.multiple = true;
            $scope.addregistrytoDB(product, qty,registryId,$scope.multiple);
          }, function() {
           $scope.multiple = false;
           $scope.addregistrytoDB(product, qty,registryId,$scope.multiple);
         }); 


         }else{
          $scope.addregistrytoDB(product, qty,registryId,$scope.multiple);
        }


      }
    }

    $scope.addregistrytoDB = function(product, qty,registryId,multiple){
     $scope.products = {};
     $scope.products._id = product._id;
     $scope.products.name = product.title;
     $scope.products.slug = product.slug;
     $scope.products.price = product.price;
     $scope.products.imageUrl = product.imageUrl;
     $scope.products.desired = qty;
     $scope.products.required = 0;
     $scope.products.prodcode = product.prodcode;
     $scope.products.linkId = product.linkId;
     $scope.products.affiliate = product.affiliate;
     $scope.products.multiple = multiple;
     var q= {};
     q.where = {};
     var f =[];
     f.push({'_id' : registryId});
     f.push({'products._id': product._id})
     q.where = { $and : f};
     Registry.query(q,function(data) {
      if(data.length==0){
        Registry.registryProduct({ id: registryId }, $scope.products, function(resp) {
          toaster.pop('success', "Product has been added successfully");
          $timeout(function() {
            window.history.back();
          }, 1000);
        },function(err) {
          console.log(err)
        });
      }else{
        toaster.pop('error', "Sorry, Product is already available in the selected Registry");
      }
    });


   }

   $scope.addtocart = function(product, qty){
    ngCart.addItem(product._id, product.title, product.price, qty, product);
    $state.go('cart');

  }


  $scope.addReview = function(review, productId) {
    $scope.addrating = false;
    Product.review({ id: productId }, review, function(resp) {
      $scope.product.reviews.push(resp);
      $scope.review = { rating: 5 };
      $scope.message = "Review added successfully"
    }, function(err) {
      console.log(err)
      $scope.message = "An error occured!"
    });
  }
}
]);

let getAverageRating = p => Math.ceil(_.reduce(p.reviews, (a, b) => a + b.rating, 0) / p.reviews.length);
