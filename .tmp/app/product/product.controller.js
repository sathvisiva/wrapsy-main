'use strict';

angular.module('bhcmartApp').controller('ProductCtrl', ['$scope', '$stateParams', '$state', 'Product', 'Registry', '$rootScope', 'Auth', 'AlertService', '$mdDialog', '$timeout', 'Cart', '$uibModal', 'toaster', function ($scope, $stateParams, $state, Product, Registry, $rootScope, Auth, AlertService, $mdDialog, $timeout, Cart, $uibModal, toaster) {

  //Get product and fetch related products based on category
  var feature = [];
  $scope.product = Product.get({ id: $stateParams.id }, function (p) {
    console.log(p);
    for (var i = 0; i < p.features.length; i++) {
      console.log(p.features[i]);
      console.log(p.features[i].selectable);
      if (p.features[i].selectable) {
        feature.push({ 'feature': p.features[i].key, 'value': p.features[i].val[0] });
      }
    }

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

  console.log(Auth.getCurrentUser());

  if (Auth.isLoggedIn()) {
    var q = { where: { username: Auth.getCurrentUser().email } };
    $scope.registryOptions = Registry.query(q);
  }

  $scope.selectedfeature = function (key, value) {
    feature.push({ 'feature': key, 'value': value });
  };

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
    product.imageUrl = product.coverimage;
    console.log(product.imageUrl);

    if (!Auth.isLoggedIn()) {
      $scope.data = { 'event': 'login' };
      $scope.login(ev, $scope.data);
      var q = { where: { username: Auth.getCurrentUser().email } };
      $scope.registryOptions = Registry.query(q);
    } else {
      if ($scope.registryOptions && $scope.registryOptions.length < 1 || !$scope.registryOptions) {
        /*$scope.message = "No Registry found. Please create Registry";*/
        $state.go('createregistry.registryType');
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
    $scope.products.feature = feature;
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
        }, function (err) {
          console.log(err);
        });
      } else {
        toaster.pop('error', "Sorry, Product is already available in the selected Registry");
      }
    });
  };

  var items = {};
  $scope.addtocart = function (ev, product, qty) {
    items.quantity = qty;
    items.features = feature;
    items.products = product._id;
    var gst = parseInt(product.gst) * 0.01 * parseInt(product.price) + parseInt(product.price);
    items.subtotal = parseInt(qty) * gst;

    if ($scope.isLoggedIn()) {
      Cart.addTocart({ id: Auth.getCurrentUser()._id }, items, function (res) {
        console.log(res.status);
        var modalInstance = $uibModal.open({
          templateUrl: 'app/cart/cart.html',
          controller: 'CartCtrl',
          size: 'lg'
        });
      }, function (err) {
        console.log(err);
        var title = "Sorry product cannot be added to Cart";
        AlertService.showAlert(err.data);
      });
    } else {
      $scope.data = { 'state': 'cart', 'event': 'login', 'items': items };
      $scope.login(ev, $scope.data);
    }
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
