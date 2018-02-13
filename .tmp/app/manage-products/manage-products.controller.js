'use strict';

angular.module('bhcmartApp').controller('ManageProductsCtrl', ['$scope', 'Product', 'Modal', '$mdDialog', 'AlertService', function ($scope, Product, Modal, $mdDialog, AlertService) {

  $scope.displayProducts = function () {
    Product.query(function (products) {
      $scope.products = products;
      // pagination controls
      $scope.currentPage = 1;
      $scope.totalItems = $scope.products.length;
      $scope.itemsPerPage = 10; // items per page
      $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
    });
  };
  $scope.displayProducts();

  $scope.deleteproduct = function (ev, product) {
    var confirm = $mdDialog.confirm().title('Would you like to delete ' + product.title + ' ?').ariaLabel('Delete Product').targetEvent(ev).ok('Please do it!').cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
      $scope.status = 'ok';
      product.$remove(product._id, function (resp) {
        $scope.query();
      });
    }, function () {
      $scope.displayProducts();

      console.log($scope.status);
    });
  };

  $scope.featuredProducts = function (featured, id, p) {
    if (featured) {
      Product.addfeaturedPdt({ id: id }, p).$promise.then(function (products) {
        $scope.displayProducts();
      });
    } else {
      Product.removefeaturedPdt({ id: id }, p).$promise.then(function (products) {
        $scope.displayProducts();
      });
    }
  };
}]).controller('ManageProductsEditCtrl', ['$scope', '$stateParams', '$state', 'Upload', 'categories', 'product', 'Product', 'Vendor', 'Feature', 'Request', '$filter', function ($scope, $stateParams, $state, Upload, categories, product, Product, Vendor, Feature, Request, $filter) {

  $scope.categories = categories;
  $scope.product = product;
  $scope.vendors = Vendor.query();

  console.log($scope.product);
  // upload on file select or drop
  // upload on file select or drop
  $scope.upload = function (file, invalid) {
    if (file) {
      Upload.upload({
        url: '/api/uploads',
        data: { file: file }
      }).then(function (resp) {

        if ($scope.product) {
          if ($scope.product.images) {
            //$scope.product.images.push(resp.data.url);
            var url = resp.data.url;
            var cover = false;
            $scope.product.images.push({
              'url': resp.data.url,
              'cover': false
            });
          } else {
            $scope.product.images = [];
            var url = resp.data.url;
            var cover = false;
            $scope.product.images.push({
              'url': resp.data.url,
              'cover': false
            });
          }
        } else {
          $scope.product = {};$scope.product.images = [];
          $scope.product.images.push(resp.data.url);
        }

        console.log($scope.product.images);
      }, function (resp) {
        $scope.errorMsg = resp.status + ': ' + resp.data;
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };
  };

  var datas = [];
  Feature.group(function (data) {
    $scope.filterfeatures = data;
    datas = data;
    console.log($scope.filterfeatures);
  });

  $scope.SelectedRow = function (key) {
    $scope.options = $filter('filter')($scope.filterfeatures, { key: key })[0].v;
    console.log($scope.options);
  };

  $scope.deleteFeature = function (index) {
    $scope.product.features.splice(index, 1);
  };

  $scope.addfeature = function (feature) {
    $scope.product.features.push(feature);
    $scope.feature = {};
    console.log($scope.product.features);
  };

  $scope.deleteImage = function (index, url) {
    $scope.product.images.splice(index, 1);
    console.log(url);
    $scope.images = {};
    $scope.images.url = url;
    Request.deleteImage($scope.images, function (requests) {
      $scope.requests = requests;
    });
  };

  $scope.save = function () {
    if (true) {
      if (!$scope.product.affiliate) {
        for (var i = 0; i < $scope.product.images.length; i++) {
          var coverimagecount = 0;
          if ($scope.product.images[i].cover) {
            coverimagecount = coverimagecount + 1;
            $scope.product.coverimage = $scope.product.images[i].url;
          }
          if (coverimagecount == 0) {
            $scope.product.coverimage = $scope.product.images[0].url;
          }
        }
      }

      Product.update($scope.product._id, $scope.product, function (resp) {
        console.log(resp);
        $state.go('admin.products');
      }, function (err) {
        console.log(err);
      });
    }
  };
}]).controller('ManageProductsAddCtrl', ['$scope', '$state', 'Product', 'categories', 'Upload', 'Feature', '$filter', '$window', 'Vendor', 'Request', function ($scope, $state, Product, categories, Upload, Feature, $filter, $window, Vendor, Request) {
  $scope.categories = categories;

  // upload on file select or drop
  $scope.upload = function (file, invalid) {
    if (file) {
      Upload.upload({
        url: '/api/uploads',
        data: { file: file }
      }).then(function (resp) {

        if ($scope.product) {
          if ($scope.product.images) {
            //$scope.product.images.push(resp.data.url);
            var url = resp.data.url;
            var cover = false;
            $scope.product.images.push({
              'url': resp.data.url,
              'cover': false
            });
          } else {
            $scope.product.images = [];
            var url = resp.data.url;
            var cover = false;
            $scope.product.images.push({
              'url': resp.data.url,
              'cover': false
            });
          }
        } else {
          $scope.product = {};$scope.product.images = [];
          $scope.product.images.push(resp.data.url);
        }

        console.log($scope.product.images);
      }, function (resp) {
        $scope.errorMsg = resp.status + ': ' + resp.data;
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };
  };

  /*var loading_screen = $window.pleaseWait({
    logo: "assets/img/logo/giftcard.jpg",
    backgroundColor: 'transparent',
    loadingHtml: '<div class="sk-spinner sk-spinner-wandering-cubes"><div class="sk-cube1"></div><div class="sk-cube2"></div></div>'
  });*/

  /*$scope.asin = "B00KGZZ824"
  $scope.product = {}
  $scope.product.asin = "B00KGZZ824"
  Product.amazonaffiliate($scope.product,function(data){
   })*/
  $scope.product = {};
  $scope.product.features = [];
  var datas = [];
  Feature.group(function (data) {
    $scope.filterfeatures = data;
    datas = data;
    console.log($scope.filterfeatures);
  });

  $scope.SelectedRow = function (key) {
    $scope.options = $filter('filter')($scope.filterfeatures, { key: key })[0].v;
    console.log($scope.options);
  };

  $scope.deleteFeature = function (index) {
    $scope.product.features.splice(index, 1);
  };

  $scope.addfeature = function (feature) {
    $scope.product.features.push(feature);
    $scope.feature = {};
    console.log($scope.product.features);
  };

  Vendor.query(function (data) {
    $scope.vendors = data;
  });

  $scope.deleteImage = function (index, url) {
    $scope.product.images.splice(index, 1);
    console.log(url);
    $scope.images = {};
    $scope.images.url = url;
    Request.deleteImage($scope.images, function (requests) {
      $scope.requests = requests;
    });
  };

  $scope.save = function () {
    if (!$scope.product.affiliate) {
      for (var i = 0; i < $scope.product.images.length; i++) {
        var coverimagecount = 0;
        if ($scope.product.images[i].cover) {
          coverimagecount = coverimagecount + 1;
          $scope.product.coverimage = $scope.product.images[i].url;
        }
        if (coverimagecount == 0) {
          $scope.product.coverimage = $scope.product.images[0].url;
        }
      }
    }
    //
    Product.save($scope.product, function (resp) {
      console.log(resp);
      $state.go('admin.products');
    }, function (err) {
      console.log(err);
    });
  };
}]);
//# sourceMappingURL=manage-products.controller.js.map
