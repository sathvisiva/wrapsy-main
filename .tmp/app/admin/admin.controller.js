'use strict';

angular.module('bhcmartApp').controller('AdminController', ['$scope', '$stateParams', 'Product', 'Order', function ($scope, $stateParams, Product, Order) {
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

  /*$scope.prodcutCount = Product.productCount({});
  $scope.orderCount = Order.orderCount({})
  console.log($scope.prodcutCount);*/
  $scope.data = {

    user: {
      name: 'Admin',
      icon: 'face'
    },
    sidenav: {
      sections: [{
        name: 'Home page',
        expandable: true,
        expand: false,
        actions: [{
          name: 'HomePage List',
          state: 'admin.managehome'
        }, {
          name: 'Add Home Page item',
          state: 'admin.addhomeImg'
        }, {
          name: 'Add Popular Categories item',
          state: 'admin.addPopularImg'
        }]
      }, {
        name: 'Vendors',
        expandable: true,
        expand: false,
        actions: [{
          name: 'Vendors List',
          state: 'admin.vendors'
        }, {
          name: 'Add Vendor',
          state: 'admin.newvendor'
        }]
      }, {
        name: 'Features',
        expandable: true,
        expand: false,
        actions: [{
          name: 'Features List',
          state: 'admin.feature'
        }]
      }, {
        name: 'Filters',
        expandable: true,
        expand: false,
        actions: [{
          name: 'Filters List',
          state: 'admin.filter'
        }]
      }, {
        name: 'Categories',
        expandable: true,
        expand: false,
        actions: [{
          name: 'Categories List',
          state: 'admin.categories'
        }, {
          name: 'Add Category',
          state: 'admin.newcategory'
        }]
      }, {
        name: 'Products',
        expandable: true,
        expand: false,
        actions: [{
          name: 'Products List',
          state: 'admin.products'
        }, {
          name: 'Add Product',
          state: 'admin.newProduct'
        }]
      }, {
        name: 'Orders',
        expandable: true,
        expand: false,
        actions: [{
          name: 'Manage Orders',
          state: 'admin.manageOrders'
        }]
      }, {
        name: 'Wedding Services',
        expandable: true,
        expand: false,
        actions: [{
          name: 'Services List',
          state: 'admin.services'
        }, {
          name: 'Add Services',
          state: 'admin.newcservices'
        }, {
          name: 'Add Service Vendor',
          state: 'admin.newcserviceVendor'
        }, {
          name: 'Service Vendors',
          state: 'admin.serviceVendors'
        }]
      }]
    }
  };
}]);

angular.module('bhcmartApp').controller('DashboardCtrl', function ($scope, Auth, Modal, $state, $mdDialog, Order, Product, Catalog, User, $mdSidenav, $mdToast) {});
//# sourceMappingURL=admin.controller.js.map
