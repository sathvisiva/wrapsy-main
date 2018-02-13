'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var HomeController = function HomeController($http, $scope, $timeout, Catalog, Product, $mdDialog, Auth, $state, Registry, toaster, Home) {
    _classCallCheck(this, HomeController);

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.slides = [];
    $scope.active = 0;
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;

    $scope.homepageimgs = Home.gethompageImg(function (res) {
      $scope.slides = res;
      console.log($scope.slides);
    });

    $scope.createRegistry = function (ev) {
      if ($scope.isLoggedIn()) {
        $state.go('createregistry.registryType');
      } else {
        $scope.data = { 'state': 'createregistry.registryType', 'event': 'login' };
        $scope.login(ev, $scope.data);
      }
    };

    Home.getpopularCat(function (resp) {
      console.log('images', resp);
      $scope.popularcat = resp;
    }, function (err) {
      console.log(err);
      $scope.message == err;
    });

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

    $scope.selectRegistryType = function () {

      if (!$scope.isLoggedIn()) {
        $state.go('login');
      } else {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/home/registryType.html',
          controller: 'RegistryTypeCtrl',
          size: 'md'
        });
      }
    };

    $scope.myregistries = function () {

      var q = { count: { username: Auth.getCurrentUser().name } };
      q._id = 1;

      Registry.query(q, function (data) {
        console.log(data);
        if (data.length == 1) {
          $state.go('manageregistry', { id: data[0]._id });
        } else {
          $scope.openregistryList(data);
        }
      });
    };

    var q = { where: { username: 'admin@wrapsytest.com' } };
    $scope.sampleregistries = Registry.query(q);
    console.log($scope.sampleregistries);

    var q = { where: { featured: true } };
    $scope.products = Product.query(q, function (products) {

      $scope.products = products;
      console.log($scope.products);
    });
  };

  angular.module('bhcmartApp').controller('HomeController', HomeController);
})();
//# sourceMappingURL=home.controller.js.map
