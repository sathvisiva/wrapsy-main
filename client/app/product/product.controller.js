'use strict';

angular.module('bhcmartApp')
.controller('ProductCtrl', ['$scope', '$stateParams', '$state', 'Product', 'Registry','$rootScope','ngCart','Auth','toaster','$mdDialog','$timeout',
  function($scope, $stateParams, $state, Product, Registry, $rootScope, ngCart,Auth, toaster,$mdDialog, $timeout) {

      //Get product and fetch related products based on category
      $scope.product = Product.get({ id: $stateParams.id }, function(p) {
        $scope.colors = p.color.split(',');
        $scope.sizes = p.size.split(',');
        $scope.product.color = $scope.colors[0];
        $scope.product.size =  $scope.sizes[0];
        $scope.qty = 1;
        $scope.product.averageRating = getAverageRating(p);
        Product.catalog({ id: p.categories[0].slug, limit: 6 }, function(relatedProducts) {
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

      $scope.addtoRegistry = function(product, qty,registryId){
        
        
        if(!Auth.isLoggedIn()){
          toaster.pop('error', "Please login to add Registry");
        }else if($scope.registryOptions.length <1){
          toaster.pop('error', "No Registry found. Please create Registry");
        }else if(!registryId){
         toaster.pop('error', "Please choose a Registry");
       }else if($scope.registry.registryId){
         
        if(product.price > 5000){
           var confirm = $mdDialog.confirm()
          .title('Would you like to delete your debt?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('solo')
          .cancel('Chip In');

    $mdDialog.show(confirm).then(function() {
      $scope.products.multiple = true;
    }, function() {
       $scope.products.multiple = false;
    }); 
          
        }


        $scope.products = {}
        $scope.products._id = product._id
        $scope.products.name = product.title
        $scope.products.slug = product.slug
        $scope.products.price = product.price
        $scope.products.imageUrl = product.imageUrl
        $scope.products.desired = qty
        $scope.products.required = 0
        $scope.products.prodcode = product.prodcode
        $scope.products.linkId = product.linkId
        $scope.products.affiliate = product.affiliate

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
