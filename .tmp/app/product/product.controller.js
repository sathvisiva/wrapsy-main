'use strict';

angular.module('bhcmartApp').controller('ProductCtrl', ['$scope', '$stateParams', '$state', 'Product', 'Registry', '$rootScope', 'ngCart', 'Auth', 'toaster', '$mdDialog', '$timeout', function ($scope, $stateParams, $state, Product, Registry, $rootScope, ngCart, Auth, toaster, $mdDialog, $timeout) {

  //Get product and fetch related products based on category
  $scope.product = Product.get({ id: $stateParams.id }, function (p) {
    if (p.color) {
      $scope.colors = p.color;
      $scope.product.color = $scope.colors[0];
    } else {
      $scope.product.color = '';
    }
    if (p.size) {
      $scope.sizes = p.size;
      $scope.product.size = $scope.sizes[0];
    } else {
      $scope.product.size = '';
    }
    console.log(p);
    $scope.qty = 1;
    $scope.product.averageRating = getAverageRating(p);
    var q = {};
    var f = [];
    f.push({ 'categories': { $in: $scope.selectedcategories } });
    q = { f: f };
    $scope.products = Product.query(q, function (relatedProducts) {
      $scope.relatedProducts = _.filter(_.map(relatedProducts, function (relatedProduct) {
        return _.extend(relatedProduct, { averageRating: getAverageRating(relatedProduct) });
      }), function (rp) {
        return rp._id != p._id;
      });
    });
    /*  Product.catalog({ id: p.categories.slug, limit: 10, page : 0  }, function(relatedProducts) {
        $scope.relatedProducts = _.filter(
          _.map(relatedProducts, relatedProduct =>
            _.extend(relatedProduct, { averageRating: getAverageRating(relatedProduct) })), rp => rp._id != p._id);
          });*/
  });

  if (Auth.isLoggedIn()) {
    var q = { where: { username: Auth.getCurrentUser().email } };
    $scope.registryOptions = Registry.query(q);
  }

  $scope.registry = {};
  $scope.registry.registryId = "";

  $scope.login = function (ev, data) {
    $mdDialog.show({
      controller: 'LoginController',
      templateUrl: 'app/account/login/login.html',
      parent: angular.element(document.body),
      targetEvent: ev,

      clickOutsideToClose: true,
      locals: {
        dataToPass: data
      }
    });

    $scope.$watch(function () {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function (wantsFullScreen) {
      $scope.customFullscreen = wantsFullScreen === true;
    });
  };

  $scope.addtoRegistry = function (ev, product, qty, registryId) {

    $scope.message = '';

    if (!Auth.isLoggedIn()) {
      $scope.message = "Please login to add Registry";
    } else {
      $scope.data = { 'event': 'login' };
      $scope.login(ev, $scope.data);
    }

    if ($scope.registryOptions && $scope.registryOptions.length < 1) {
      $scope.message = "No Registry found. Please create Registry";
    } else if (!registryId) {
      $scope.message = "Please choose a Registry";
    } else if ($scope.registry.registryId) {

      $scope.multiple = false;

      if (product.price > 5000 && !product.affiliate) {
        var confirm = $mdDialog.confirm().textContent('Would you like to wishlist this item as a solo item or put it under a chip-in category so that multiple guests can chip- in towards it?').ariaLabel('solo or multichipin').targetEvent(ev).ok('Chip In').cancel('Solo');

        $mdDialog.show(confirm).then(function () {
          $scope.multiple = true;
          $scope.addregistrytoDB(product, qty, registryId, $scope.multiple);
        }, function () {
          $scope.multiple = false;
          $scope.addregistrytoDB(product, qty, registryId, $scope.multiple);
        });
      } else {
        $scope.addregistrytoDB(product, qty, registryId, $scope.multiple);
      }
    }
  };

  $scope.addregistrytoDB = function (product, qty, registryId, multiple) {
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
    $scope.products.color = product.color;
    $scope.products.size = product.size;
    if (multiple) {
      $scope.products.price = $scope.products.price * qty;
    }
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
  };

  $scope.addtocart = function (product, qty) {
    console.log(product);
    var gst = parseInt(product.sgst) + parseInt(product.cgst);
    var gstamount = parseInt(gst) * parseInt(qty) * parseInt(product.price) / 100;
    ngCart.addItem(product._id, product.title, product.price, qty, product, product.color, product.size, gstamount);
    $state.go('cart');
  };

  $scope.addReview = function (review, productId) {
    $scope.addrating = false;
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
