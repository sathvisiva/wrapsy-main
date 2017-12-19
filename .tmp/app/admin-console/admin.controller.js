'use strict';

angular.module('bhcmartApp').controller('FeaturedProductsCtrl', ['$scope', 'Product', 'Modal', function ($scope, Product, Modal) {

  Product.query(function (products) {
    console.log(products);
    $scope.products = products;
    $scope.currentPage = 1;
    $scope.totalItems = $scope.products.length;
    $scope.itemsPerPage = 10; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  });

  $scope.addtoFeaturedProducts = function (id, p) {
    console.log(id);
    Product.addfeaturedPdt({ id: id }, p).$promise.then(function (products) {
      $scope.products = products;
      $scope.currentPage = 1;
      $scope.totalItems = $scope.products.length;
      $scope.itemsPerPage = 10; // items per page
      $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
    });
  };

  $scope.removefromFeaturedProducts = function (id, p) {
    console.log(id);
    Product.removefeaturedPdt({ id: id }, p).$promise.then(function (products) {
      $scope.products = products;
      $scope.currentPage = 1;
      $scope.totalItems = $scope.products.length;
      $scope.itemsPerPage = 10; // items per page
      $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
    });
  };

  /*     Product.query(function(products) {
         $scope.products = products;
         // pagination controls
         $scope.currentPage = 1;
         $scope.totalItems = $scope.products.length;
         $scope.itemsPerPage = 10; // items per page
         $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
       });*/

  $scope.deleteFeature = Modal.confirm['delete'](function (f) {
    Product.destroyFeature({ id: f._id }, f).$promise.then(function (res) {
      console.log(res);
      $scope.features.splice($scope.features.indexOf(f), 1);
    });

    /*  f.$remove(f._id, function(resp) {
        console.log(resp)
        
      })*/
  });
}]).controller('AdminCtrl', function ($scope, Auth, Modal, ngCart, $state, $mdDialog, Order, Product, Catalog, User, $mdSidenav, $mdToast) {

  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.toggleSidenav = function (menu) {
    $mdSidenav(menu).toggle();
  };
  $scope.toast = function (message) {
    var toast = $mdToast.simple().content('You clicked ' + message).position('bottom right');
    $mdToast.show(toast);
  };
  $scope.toastList = function (message) {
    var toast = $mdToast.simple().content('You clicked ' + message + ' having selected ' + $scope.selected.length + ' item(s)').position('bottom right');
    $mdToast.show(toast);
  };
  $scope.selected = [];
  $scope.toggle = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) list.splice(idx, 1);else list.push(item);
  };
  $scope.data = {
    title: 'Dashboard',
    user: {
      name: 'Angular Ninja',
      email: 'angular@ninja.com',
      icon: 'face'
    },
    toolbar: {
      buttons: [{
        name: 'Button 1',
        icon: 'add',
        link: 'Button 1'
      }],
      menus: [{
        name: 'Menu 1',
        icon: 'message',
        width: '4',
        actions: [{
          name: 'Action 1',
          message: 'Action 1',
          completed: true,
          error: true
        }, {
          name: 'Action 2',
          message: 'Action 2',
          completed: false,
          error: false
        }, {
          name: 'Action 3',
          message: 'Action 3',
          completed: true,
          error: true
        }]
      }]
    },
    sidenav: {
      sections: [{
        name: 'Section 1',
        expand: true,
        actions: [{
          name: 'Action 1',
          icon: 'settings',
          link: 'Action 1'
        }, {
          name: 'Action 2',
          icon: 'settings',
          link: 'Action 2'
        }]
      }, {
        name: 'Section 2',
        expand: false,
        actions: [{
          name: 'Action 3',
          icon: 'settings',
          link: 'Action 3'
        }]
      }, {
        name: 'Section 3',
        expand: false,
        actions: [{
          name: 'Action 4',
          icon: 'settings',
          link: 'Action 4'
        }, {
          name: 'Action 5',
          icon: 'settings',
          link: 'Action 5'
        }, {
          name: 'Action 6',
          icon: 'settings',
          link: 'Action 6'
        }]
      }]
    },
    content: {
      lists: [{
        name: 'List 1',
        menu: {
          name: 'Menu 1',
          icon: 'settings',
          width: '4',
          actions: [{
            name: 'Action 1',
            message: 'Action 1',
            completed: true,
            error: true
          }]
        },
        items: [{
          name: 'Item 1',
          description: 'Description 1',
          link: 'Item 1'
        }, {
          name: 'Item 2',
          description: 'Description 2',
          link: 'Item 2'
        }, {
          name: 'Item 3',
          description: 'Description 3',
          link: 'Item 3'
        }]
      }]
    }
  };

  /*$scope.registry._id = $stateParams.id*/

  $scope.adminPage = function (state) {
    $scope.state = 'adminconsole.' + state;
    $state.go($scope.state);
  };

  var q = {};
  q.where = {};
  var f = [];
  f.push({ 'created': { $gte: moment().startOf('week').toDate() } });
  q.where = { f: f };

  $scope.filter = {};
  $scope.filter.startday = moment().startOf('week').toDate();
  $scope.filter.endOfWeek = moment().endOf('week').toDate();
  console.log($scope.filter);

  Order.countorders(q, function (orders) {
    $scope.orderscount = orders[0].count;
    console.log($scope.orderscount);
  });

  Product.productCount(function (product) {
    $scope.productCount = product[0].count;
  });

  Catalog.catalogCount(function (catalog) {
    $scope.catalogCount = catalog[0].count;
  });

  User.userCount(function (user) {
    $scope.userCount = user[0].count;
  });

  $scope.features = Product.indexFeatures();
  console.log($scope.features.length);

  $scope.orderstatus = [{ id: 1, status: "Processed" }, { id: 2, status: "Complete" }, { id: 3, status: "Open" }, { id: 3, status: "Canceled" }];

  $scope.viewOrders = function () {
    Order.query(function (orders) {
      $scope.orders = orders;
      // pagination controls
      $scope.currentPage = 1;
      $scope.totalItems = $scope.orders.length;
      $scope.itemsPerPage = 10; // items per page
      $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
    });
    console.log($scope.orders);
    $state.go('admin-console.orders');
  };

  $scope.removeProduct = function (ev, productName, product) {
    var confirm = $mdDialog.confirm().title('Confirm').textContent('Would you like to remove' + productName + 'from your cart').ariaLabel('remove product').targetEvent(ev).ok('Please do it!').cancel('cancel');

    $mdDialog.show(confirm).then(function () {
      ngCart.removeItemById(product.getId());
    }, function () {});
  };

  $scope.checkout = function (ev) {
    if ($scope.isLoggedIn()) {
      $state.go('checkout');
    } else {
      $scope.data = { 'state': 'checkout', 'event': 'login' };
      $scope.login(ev, $scope.data);
    }
  };
});
//# sourceMappingURL=admin.controller.js.map
