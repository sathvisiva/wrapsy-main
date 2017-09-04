'use strict';

angular.module('bhcmartApp').controller('CategoryCtrl', ['$scope', '$stateParams', 'Product', '$rootScope', '$state', 'Catalog', function ($scope, $stateParams, Product, $rootScope, $state, Catalog) {

  $scope.categoryTitle = $stateParams.slug;

  $scope.sizes = ["S", "M", "L", "XL", "XXL"];
  $scope.colors = ["Blue", "Brown", "Green", "Red"];
  $scope.pricerange = ["0 -500", "500-5000", "5000 +"];

  $scope.page = 1;

  $scope.list = 5;

  $scope.priceSlider = {};
  /*
    $scope.priceSlider = {
      min: 0,
      max: 10000,
      ceil: 10000,
      floor: 0,
      step:100
    };*/

  $scope.slider = {
    minValue: 0,
    maxValue: 10000,
    options: {
      floor: 0,
      ceil: 10000,
      step: 1,
      onEnd: function onEnd() {
        $scope.filter();
      }
    }
  };

  $scope.selected = {
    sizes: {},
    colors: {}
  };

  //    selected.sizes

  $scope.displayProducts = function (q) {
    $scope.products = Product.query(q, function (res) {
      console.log(res);
    });
    console.log($scope.products);
    console.log(q);
    Product.productCount(q, function (res) {
      $scope.totalItems = res[0].count;
      console.log("items" + $scope.totalItems);
      $scope.totalPages = Math.round($scope.totalItems / $scope.list);
      console.log("pages" + $scope.totalPages);
      if ($scope.totalPages == $scope.page) {
        $scope.disablednext = true;
      }
      if ($scope.totalPages != $scope.page) {
        console.log("inside second if");
        $scope.disablednext = false;
      }
    });
  };

  $scope.sizechanged = function () {
    $scope.filter(false, $scope.page);
  };

  $scope.colorchanged = function () {
    $scope.filter(false, $scope.page);
  };

  $scope.category = Catalog.get({ id: $stateParams.slug }, function (category) {
    console.log(category);
    $scope.selectedcategories = [category._id].concat(category.children);
    var r = { where: { parent: category._id } };
    $scope.childcategories = Catalog.query(r);

    $scope.filter(true, $scope.page);
  });

  $scope.nextPage = function () {
    if ($scope.page < $scope.totalPages) {
      $scope.page = $scope.page + 1;
      $scope.filter(false, $scope.page);
      /*  var q = {};
        var f = [];
        f.push({'categories' : { $in: $scope.selectedcategories  } }); 
        q.where = { $and : f};
        q.sort = 'asc';
        q.skip = ($scope.page - 1 )*$scope.list;
        console.log("skip" + q.skip);
        q.list = $scope.list;
        $scope.displayProducts(q);*/
    }

    if ($scope.totalPages == $scope.page) {
      $scope.disablednext = true;
    }
    if ($scope.totalPages != $scope.page) {
      console.log("inside second if");
      $scope.disablednext = false;
    }
  };

  $scope.previousPage = function () {

    if ($scope.page > 1) {
      $scope.page = $scope.page - 1;
      $scope.filter(false, $scope.page);
    }
    if ($scope.totalPages == $scope.page) {
      $scope.disablednext = true;
    }
    if ($scope.totalPages != $scope.page) {
      console.log("inside second if");
      $scope.disablednext = false;
    }

    /* $scope.page = $scope.page - 1;
     $stateParams.slug == 'all' ? Product.query(process($scope)) : Product.catalog({ id: $stateParams.slug, limit: 4, page : $scope.page  },q);*/
  };

  $scope.filter = function (flush, page) {

    var q = {};
    var f = [];
    f.push({ 'categories': { $in: $scope.selectedcategories } });
    f.push({ 'price': { $gt: $scope.slider.minValue, $lt: $scope.slider.maxValue } });

    var sizes = [];
    /*console.log("sizes"+Object.keys($scope.selected.sizes));*/
    console.log("selectedsizes" + $scope.selected.sizes.toString());
    console.log($scope.selected.sizes);
    angular.forEach(Object.keys($scope.selected.sizes), function (size) {
      if ($scope.selected.sizes[size]) {
        sizes.push(size);
      }
    });

    if (sizes.length > 0) {
      console.log("inside sizes");
      f.push({ 'size': { $in: sizes } });
    }

    var colors = [];
    /*console.log("sizes"+Object.keys($scope.selected.sizes));*/
    angular.forEach(Object.keys($scope.selected.colors), function (color) {
      if ($scope.selected.colors[color]) {
        colors.push(color);
      }
    });

    if (colors.length > 0) {
      console.log("inside colors");
      console.log(colors);
      f.push({ 'color': { $in: colors } });
    }
    q.where = { $and: f };
    q.sort = 'asc';
    q.skip = ($scope.page - 1) * $scope.list;
    q.list = $scope.list;

    /*console.log($scope.selected.sizes);*/

    $scope.displayProducts(q);
  };
}]);
/*
let getAverageRating = p => Math.ceil(_.reduce(p.reviews, (a, b) => a + b.rating, 0) / p.reviews.length); */

/*let process = $scope => prod => {
  console.log(prod);
  
  // pagination controls
  $scope.currentPage = 1;
  $scope.totalItems = $scope.products.length;
  console.log($scope.totalItems)
  $scope.itemsPerPage = 5; // items per page
  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
}*/
//# sourceMappingURL=category.controller.js.map
