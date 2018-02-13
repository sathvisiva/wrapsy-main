'use strict';

angular.module('bhcmartApp.admin').config(function ($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminController',
    authenticate: 'admin'
  }).state('admin.dashboard', {
    url: '/',
    controller: 'DashboardCtrl',
    templateUrl: 'app/admin/dashboard.html'
  }).state('admin.vendors', {
    url: '/vendors',
    templateUrl: 'app/vendors/vendors.html',
    controller: 'ManageVendorsCtrl'
  }).state('admin.newvendor', {
    url: '/newvendors',
    templateUrl: 'app/vendors/newvendors.html',
    controller: 'VendorsAddCtrl'
  }).state('admin.editvendor', {
    url: '/editvendor/{id}',
    templateUrl: 'app/vendors/newvendors.html',
    controller: 'VendorsEditCtrl'
  }).state('admin.filter', {
    url: '/filter',
    templateUrl: 'app/filters/filters.html',
    controller: 'FiltersCtrl'
  }).state('admin.feature', {
    url: '/feature',
    templateUrl: 'app/features/features.html',
    controller: 'FeaturesCtrl'
  }).state('admin.categories', {
    url: '/catagories',
    templateUrl: 'app/manage-categories/manage-categories.html',
    controller: 'ManageCategoriesCtrl'
  }).state('admin.newcategory', {
    url: '/newcatagory',
    templateUrl: 'app/manage-categories/manage-categories-add.html',
    controller: 'ManageCategoriesAddCtrl'
  }).state('admin.editcategory', {
    url: '/editcategory/{id}',
    templateUrl: 'app/manage-categories/manage-categories-add.html',
    controller: 'ManageCategoriesEditCtrl'
  }).state('admin.products', {
    url: '/products',
    templateUrl: 'app/manage-products/manage-products.html',
    controller: 'ManageProductsCtrl'
  }).state('admin.newProduct', {
    url: '/newProduct',
    templateUrl: 'app/manage-products/manage-products-add.html',
    controller: 'ManageProductsAddCtrl',
    resolve: {
      categories: ['Catalog', function (Catalog) {
        return Catalog.query();
      }]
    }
  }).state('admin.editProduct', {
    url: '/editProduct/{id}',
    templateUrl: 'app/manage-products/manage-products-add.html',
    controller: 'ManageProductsEditCtrl',
    resolve: {
      categories: ['Catalog', function (Catalog) {
        return Catalog.query();
      }],
      product: ['Product', '$stateParams', function (Product, $stateParams) {
        return Product.get({ id: $stateParams.id });
      }]
    }
  }).state('admin.addBlog', {
    url: '/addBlog',
    templateUrl: 'app/blog/Add-blog.html',
    controller: 'AddBlogCtrl'
  }).state('admin.listBlog', {
    url: '/listBlog',
    templateUrl: 'app/blog/blog.html',
    controller: 'BlogListCtrl'
  }).state('admin.editBlog', {
    url: '/editBlog/{id}',
    templateUrl: 'app/blog/editblog.html',
    controller: 'BlogEditCtrl'
  }).state('admin.manageOrders', {
    url: '/manageOrders',
    templateUrl: 'app/manage-orders/manageorders.html',
    controller: 'ManageOrdersCtrl'
  }).state('admin.manageRequest', {
    url: '/manageRequest',
    templateUrl: 'app/manage-requests/manage-requests.html',
    controller: 'ManageRequestsCtrl'
  }).state('admin.managehome', {
    url: '/managehome',
    templateUrl: 'app/manage-home/manage-home-image.html',
    controller: 'ManageHomeCtrl'
  }).state('admin.addhomeImg', {
    url: '/addhomeImg',
    templateUrl: 'app/manage-home/add-home-image.html',
    controller: 'ManageHomePageImgAddCtrl'
  }).state('admin.addPopularImg', {
    url: '/addPopularImg',
    templateUrl: 'app/manage-home/add-popcategory.html',
    controller: 'ManagePopularCategoriesAddCtrl'
  }).state('admin.services', {
    url: '/services',
    templateUrl: 'app/manage-service/manage-services.html',
    controller: 'ManageServicesCtrl'
  }).state('admin.newcservices', {
    url: '/newservice',
    templateUrl: 'app/manage-service/manage-services-add.html',
    controller: 'ManageServicesAddCtrl'
  }).state('admin.newcserviceVendor', {
    url: '/newserviceVendor',
    templateUrl: 'app/manage-service/add-service-vendor.html',
    controller: 'ManageServiceVendorAddCtrl'
  }).state('admin.serviceVendors', {
    url: '/serviceVendors',
    templateUrl: 'app/manage-service/manage-service-vendor.html',
    controller: 'ManageServicesVendorsCtrl'
  }).state('admin.editserviceVendor', {
    url: '/editserviceVendor/{id}',
    templateUrl: 'app/manage-service/add-service-vendor.html',
    controller: 'ManageServiceVendorEditCtrl'
  });
});
//# sourceMappingURL=admin.router.js.map
