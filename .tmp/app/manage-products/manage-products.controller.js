'use strict';

angular.module('bhcmartApp').controller('ManageProductsCtrl', ['$scope', 'Product', 'Modal', function ($scope, Product, Modal) {
  Product.query(function (products) {
    console.log(products);
    $scope.products = products;
    // pagination controls
    $scope.currentPage = 1;
    $scope.totalItems = $scope.products.length;
    $scope.itemsPerPage = 10; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  });

  $scope.deleteProduct = Modal.confirm['delete'](function (p) {
    if (p.slug == 'all') return;
    p.$remove(p._id, function (resp) {
      console.log(resp);
      $scope.products.splice($scope.products.indexOf(p), 1);
    });
  });
}]).controller('ManageProductsEditCtrl', ['$scope', '$stateParams', '$state', 'Upload', 'Catalog', 'Product', function ($scope, $stateParams, $state, Upload, Catalog, Product) {

  $scope.categories = Catalog.query();
  console.log($scope.categories);
  $scope.product = Product.get({ id: $stateParams.id }, function (data) {
    console.log(data);
    $scope.product.categories = $scope.product.categories._id;
  });
  $scope.features = Product.indexFeatures();

  $scope.addFeatures = function (productfeatures) {
    $scope.product.features.push(productfeatures);
  };

  $scope.del = function (i) {
    $scope.product.features.splice(i, 1);
  };

  $scope.upload = function (file) {
    if ($scope.form.imageUrl.$valid && file) {
      Upload.upload({
        url: '/api/uploads',
        data: { file: file }
      }).then(function (resp) {
        if ($scope.product) {
          $scope.product.imageUrl = resp.data.url;
        } else {
          $scope.product = { imageUrl: resp.data.imageUrl };
        }
        console.log(resp.data);
      }, function (resp) {
        $scope.errorMsg = resp.status + ': ' + resp.data;
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };
  };

  $scope.save = function (form) {
    if (form.$valid) {
      Product.update($scope.product._id, $scope.product, function (resp) {
        console.log(resp);
        $state.go('adminconsole.pdtlist');
      }, function (err) {
        console.log(err);
      });
    }
  };
}]).controller('ManageProductsAddCtrl', ['$scope', '$state', 'Product', 'categories', '$uibModal', 'Upload', function ($scope, $state, Product, categories, $uibModal, Upload) {
  $scope.categories = categories;

  $scope.productType = "Normal";

  $scope.product = {};

  $scope.product.features = [];

  $scope.features = Product.indexFeatures();
  // upload on file select or drop
  $scope.upload = function (file) {
    if ($scope.form.imageUrl.$valid && file) {
      Upload.upload({
        url: '/api/uploads',
        data: { file: file }
      }).then(function (resp) {
        if ($scope.product) {
          $scope.product.imageUrl = resp.data.url;
        } else {
          $scope.product = { imageUrl: resp.data.imageUrl };
        }
        console.log(resp.data);
      }, function (resp) {
        $scope.errorMsg = resp.status + ': ' + resp.data;
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };
  };

  $scope.addFeatures = function (productfeatures) {
    $scope.product.features.push(productfeatures);
  };

  $scope.del = function (i) {
    $scope.product.features.splice(i, 1);
  };

  $scope.save = function (form) {
    if ($scope.product.color) {
      $scope.product.color = $scope.product.color.split(',');
    }if ($scope.product.size) {
      $scope.product.size = $scope.product.size.split(',');
    }
    if (form.$valid) {
      Product.save($scope.product, function (resp) {
        console.log(resp);
        $state.go('adminconsole.pdtlist');
      }, function (err) {
        console.log(err);
      });
    }
  };
}]);
//# sourceMappingURL=manage-products.controller.js.map
