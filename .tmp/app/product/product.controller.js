'use strict';

angular.module('bhcmartApp').controller('ProductCtrl', ['$scope', '$stateParams', '$state', 'Product', 'Registry', '$rootScope', 'RegistryService', 'Auth', 'toaster', '$timeout', function ($scope, $stateParams, $state, Product, Registry, $rootScope, RegistryService, Auth, toaster, $timeout) {

  $scope.product = Product.get({ id: $stateParams.id }, function (p) {

    $scope.colors = p.color.split(',');
    $scope.sizes = p.size.split(',');
    $scope.selectedObj = {};
    $scope.product.averageRating = getAverageRating(p);
    Product.catalog({ id: p.categories[0].slug, limit: 6 }, function (relatedProducts) {
      $scope.relatedProducts = _.filter(_.map(relatedProducts, function (relatedProduct) {
        return _.extend(relatedProduct, { averageRating: getAverageRating(relatedProduct) });
      }), function (rp) {
        return rp._id != p._id;
      });
    });
  });

  if (Auth.isLoggedIn()) {
    var q = { where: { username: Auth.getCurrentUser().email } };
    $scope.registryOptions = Registry.query(q);
  }

  $scope.registry = {};
  $scope.registry.registryId = "";

  $scope.registryId = RegistryService.getregistry()._id;

  $scope.addtoRegistry = function (product, qty, registryId) {

    if (!Auth.isLoggedIn()) {
      toaster.pop('error', "Please login to add Registry");
    } else if ($scope.registryOptions.length < 1) {
      toaster.pop('error', "No Registry found. Please create Registry");
    } else if (!registryId) {
      toaster.pop('error', "Please choose a Registry");
    } else if ($scope.registry.registryId) {

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

      var q = {};
      q.where = {};
      var f = [];
      f.push({ '_id': registryId });
      f.push({ 'products._id': product._id });
      q.where = { $and: f };
      Registry.query(q, function (data) {
        if (data.length == 0) {
          Registry.registryProduct({ id: registryId }, $scope.products, function (resp) {
            toaster.pop('success', "Product has been added successfully");
            $timeout(function () {
              window.history.back();
            }, 1000);
          }, function (err) {
            console.log(err);
          });
        } else {
          toaster.pop('error', "Sorry, Product is already available in the selected Registry");
        }
      });
    }
  };

  $scope.addReview = function (review, productId) {
    Product.review({ id: productId }, review, function (resp) {
      $scope.product.reviews.push(resp);
      $scope.review = { rating: 5 };
      $scope.message = "Review added successfully";
    }, function (err) {
      console.log(err);
      $scope.message = "An error occured!";
    });
  };
}]);

var getAverageRating = function getAverageRating(p) {
  return Math.ceil(_.reduce(p.reviews, function (a, b) {
    return a + b.rating;
  }, 0) / p.reviews.length);
};
//# sourceMappingURL=product.controller.js.map
