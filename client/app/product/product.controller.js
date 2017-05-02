'use strict';

angular.module('bhcmartApp')
  .controller('ProductCtrl', ['$scope', '$stateParams', '$state', 'Product', 'Registry','$rootScope','RegistryService','Auth',
    function($scope, $stateParams, $state, Product, Registry, $rootScope, RegistryService,Auth) {
    
      //Get product and fetch related products based on category
      $scope.product = Product.get({ id: $stateParams.id }, function(p) {
        $scope.product.averageRating = getAverageRating(p);
        Product.catalog({ id: p.categories[0].slug, limit: 6 }, function(relatedProducts) {
          $scope.relatedProducts = _.filter(
            _.map(relatedProducts, relatedProduct =>
              _.extend(relatedProduct, { averageRating: getAverageRating(relatedProduct) })), rp => rp._id != p._id);
        });
      });

      var q = {where:{username:Auth.getCurrentUser().email}};

	$scope.registryOptions =  Registry.query(q);

	$scope.registry = {}
	$scope.registry.registryId = ""

  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];



	$scope.registryId = RegistryService.getregistry()._id

      $scope.addtoRegistry = function(product, qty,registryId){
          $scope.show = false;

    $scope.closeAlert = function(index) {
    $scope.show = false;
    };
      	if(!Auth.isLoggedIn()){
          $state.go('login');
        }else if($scope.registry.registryId){

          	
          $scope.products = {}
          $scope.products._id = product._id
          $scope.products.name = product.title
          $scope.products.slug = product.slug
          $scope.products.price = product.price
          $scope.products.imageUrl = product.imageUrl
          $scope.products.desired = qty
          $scope.products.required = 0

          var q= {};
  			q.where = {};
  			var f =[];
  			$scope.registryId	=		$scope.registry.registryId
  				console.log($scope.registryId)
  			f.push({'_id' : $scope.registryId});
  			f.push({'products._id': product._id})
  			q.where = { $and : f};
  			Registry.query(q,function(data) {
    if(data.length==0){
      Registry.get({id:$scope.registryId},function(registry){
      		Registry.registryProduct({ id: $scope.registryId }, $scope.products, function(resp) {
          
          $state.go('main');
        }, function(err) {
          console.log(err)
          $scope.message = "An error occured!"
        });
    });
    }else{
      $state.go('main');
      console.log("Product already available in Registry","Sorry");
    }
  });




}


     

      }


      $scope.addReview = function(review, productId) {
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
