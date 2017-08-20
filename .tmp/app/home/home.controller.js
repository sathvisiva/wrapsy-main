'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var HomeController = function HomeController($http, $scope, $timeout, Catalog, Product, $mdDialog, Auth, $state, Registry, toaster) {
    _classCallCheck(this, HomeController);

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.slickConfig3Loaded = true;
    $scope.slickConfig3 = {
      method: {},
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      }, {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
    };

    $scope.slides = [];
    $scope.active = 0;
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;

    for (var i = 1; i < 5; i++) {
      $scope.slides.push({
        image: 'assets/img/banner' + i + '.jpg',
        text: "The Perfect Gift to Complete your Perfect Celebration"
      });
    }

    $scope.createRegistry = function (ev) {
      if ($scope.isLoggedIn()) {
        $state.go('createregistry.registryType');
      } else {
        $scope.data = { 'state': 'createregistry.registryType', 'event': 'login' };
        $scope.login(ev, $scope.data);
      }
    };

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

    $scope.registryslides = [{ image: 'assets/img/sampleWedding.jpg', registry: '59177dd6fb639b354f5e9d63', text: "Wedding Registry" }, { image: 'assets/img/sampleBaby.jpg', registry: '59177e86fb639b354f5e9d65', text: "Baby Registry" }, { image: 'assets/img/sampleWishlist.jpg', registry: '59177eebfb639b354f5e9d67', text: "House Warming Registry" }, { image: 'assets/img/samplebirthday.jpg', registry: '59177e86fb639b354f5e9d65', text: "Birthday Registry" }];

    var q = { where: { featured: true } };
    $scope.products = Product.query(q, function (products) {

      $scope.products = products;
      console.log($scope.products.length);
    });
  };

  angular.module('bhcmartApp').controller('HomeController', HomeController);
})();

angular.module('bhcmartApp').controller('RegistryTypeCtrl', function ($scope, $uibModalInstance, $state) {

  $scope.ok = function (registrytype) {
    $uibModalInstance.dismiss('cancel');
    $state.go('createregistry', { type: registrytype });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
//# sourceMappingURL=home.controller.js.map
