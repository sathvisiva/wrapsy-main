'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var CreateRegistryController = function CreateRegistryController($http, $scope, $timeout, Registry, $uibModal, $state, Auth, $stateParams, RegistryService, Address) {
    _classCallCheck(this, CreateRegistryController);

    $state.go('createregistry.registryType');

    $scope.disableevent = true;
    $scope.disablelocation = true;
    $scope.disablemessage = true;
    $scope.enableSecondName = false;
    $scope.eventformsubmitted = false;
    $scope.locationformsubmitted = false;
    this.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.phoneNumbr = /^\+?\d{2}\d{3}\d{5}$/;
    $scope.registry = {};
    $scope.address = {};

    $scope.eventType = function (type) {
      $scope.registry.type = type;
      if ($scope.registry.type == 'wedding') {
        $scope.enableSecondName = true;
      }
      $scope.disableevent = false;
      $state.go('createregistry.eventDetails');
      console.log($scope.registry);
    };

    $scope.saveeventdetails = function (form) {
      $scope.eventformsubmitted = false;
      if (!form.$valid) {
        $scope.eventformsubmitted = true;
      } else {
        $scope.disablelocation = false;
        $state.go('createregistry.location');
        console.log($scope.registry);
      }
    };

    $scope.savelocation = function (form) {
      $scope.locationformsubmitted = false;
      if (!form.$valid) {
        $scope.locationformsubmitted = true;
      } else {
        $scope.disablemessage = false;
        $state.go('createregistry.message');
      }
    };

    $scope.registryType = function (state) {
      $scope.state = 'createregistry.' + state;
      console.log($scope.state);
      $state.go($scope.state);
    };

    $scope.save = function (form) {
      console.log(form.$valid);
      if (form.$valid) {
        console.log($scope.getCurrentUser());
        $scope.registry.username = $scope.getCurrentUser().email;
        $scope.registry.backgroundImageUrl = 'assets/img/cover.jpg';
        $scope.registry.profileImageUrl = 'assets/img/noimage.jpg';
        Registry.save($scope.registry, function (resp) {
          $scope.address.registryId = resp._id;
          Address.save($scope.address, function (resp) {}, function (err) {
            console.log(err);
          });
          $state.go('registry', { id: resp._id });
        }, function (err) {
          console.log(err);
        });
      }
    };

    $scope.setDate = function (year, month, day) {
      $scope.registry.date = new Date(day, month, year);
    };

    var date = new Date();
    $scope.setDate(date.getFullYear(), date.getMonth(), date.getDate());

    $scope.registry.date = new Date();

    $scope.clear = function () {
      $scope.registry.date = null;
    };

    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };
    $scope.popup1 = { opened: false };

    $scope.options = {
      minDate: new Date()
    };
  };

  angular.module('bhcmartApp').controller('CreateRegistryController', CreateRegistryController);
})();

angular.module('bhcmartApp').controller('RegistryController', ['$scope', '$stateParams', '$state', 'Registry', '$uibModal', 'Upload', 'RegistryService', 'Auth', 'toaster', '$timeout', function ($scope, $stateParams, $state, Registry, $uibModal, Upload, RegistryService, Auth, toaster, $timeout) {

  $scope.removeProduct = function (pid) {
    for (var i = $scope.registry.products.length - 1; i >= 0; i--) {
      if ($scope.registry.products[i]._id == pid) {
        $scope.registry.products.splice(i, 1);
      }
    }
    Registry.update({ id: $scope.registry._id }, $scope.registry).$promise.then(function (res) {
      $scope.registry = res;
      toaster.pop('success', "Product successfully deleted");
    });
  };

  $scope.queryRegistry = function () {

    $scope.registry = Registry.get({ id: $stateParams.id }, function (resp) {
      if (Auth.getCurrentUser().email == resp.username) {
        $scope.editable = true;
      }
      if (!resp.products) {
        $scope.showassistance = true;
      }
    });
  };

  $scope.queryRegistry();

  $scope.updatedesired = function () {
    Registry.update({ id: $scope.registry._id }, $scope.registry).$promise.then(function (res) {
      $scope.registry = res;
      toaster.pop('success', "Product desired count updated");
    });
  };

  $scope.inviteFriends = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/registry/invite.html',
      controller: 'inviteRegistryCtrl',
      size: 'md'
    }).result.then(function (result) {});
    /* $scope.registry.backgroundImageUrl = "assets/img/cover.jpg"
    */
  };

  $scope.selectBackgroundImage = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/registry/backgroundImages.html',
      controller: 'backgroundImageCtrl',
      size: 'lg'
    }).result.then(function (result) {
      $scope.registry.backgroundImageUrl = result;
      Registry.update({ id: $scope.registry._id }, $scope.registry).$promise.then(function (res) {
        console.log("success");
      });
    });
  };

  $scope.productDetail = function (product) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/registry/registry-product.html',
      controller: 'RegistryProductDetailCtrl',
      size: 'md',
      resolve: {
        registry: function registry() {
          return $scope.registry._id;
        }, registryprod: function registryprod() {
          return product;
        }
      }
    }).result.then(function (result) {
      console.log(result);
      $scope.queryRegistry();
    });
    /* }*/
    /* $scope.registry.backgroundImageUrl = "assets/img/cover.jpg"
    */
  };

  $scope.setVisible = function () {
    $scope.registry.visible = true;
    Registry.update({ id: $scope.registry._id }, $scope.registry).$promise.then(function (res) {
      console.log("success");
    });
  };

  $scope.upload = function (file) {
    if (file) {
      Upload.upload({
        url: '/api/uploads',
        data: { file: file }
      }).then(function (resp) {
        if ($scope.registry) {

          $scope.registry.profileImageUrl = resp.data.url;

          Registry.update({ id: $scope.registry._id }, $scope.registry).$promise.then(function (res) {
            console.log("success");
          });
        } else {
          $scope.registry = { profileImageUrl: resp.data.imageUrl };
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
}]);

angular.module('bhcmartApp').controller('backgroundImageCtrl', ['$scope', '$stateParams', '$state', 'Registry', '$uibModalInstance', function ($scope, $stateParams, $state, Registry, $uibModalInstance) {

  $scope.ok = function (imageUrl) {
    $uibModalInstance.close(imageUrl);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);

angular.module('bhcmartApp').controller('RegistryProductDetailCtrl', ['$scope', '$stateParams', '$state', 'Registry', '$uibModalInstance', 'registry', 'registryprod', 'Product', 'ngCart', function ($scope, $stateParams, $state, Registry, $uibModalInstance, registry, registryprod, Product, ngCart) {

  $scope.registryid = registry;
  $scope.registryprod = registryprod;

  $scope.addtocart = function (qty) {

    ngCart.addItem($scope.product._id, $scope.product.title, $scope.product.price, qty, $scope.product, $scope.registryid);
    $uibModalInstance.close();
  };

  $scope.buyNow = function (qyt) {
    $uibModalInstance.close("test");
    Registry.updatePdtcnt({ id: $scope.registryid }, $scope.product, function (resp) {}, function (err) {
      console.log(err);
      $scope.message = "An error occured!";
    });
  };

  $scope.product = Product.get({ id: registryprod.slug });

  $scope.max = parseInt(registryprod.desired) - parseInt(registryprod.required);

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
angular.module('bhcmartApp').controller('FindRegistryController', ['$scope', '$stateParams', '$state', 'Registry', function ($scope, $stateParams, $state, Registry) {

  $scope.searchRegistry = function () {
    $scope.display = false;
    var q = { where: { title: { '$regex': $scope.input } } };
    q.where.title.$options = "$i";
    $scope.registries = Registry.query(q, function (data) {

      var groupArrayNew = [];

      angular.forEach(data, function (item, idx) {
        if (item.visible) groupArrayNew.push(item);
      });
      if (groupArrayNew.length == 0) {
        console.log("inside loog");
        $scope.display = true;
        console.log($scope.display);
      }
    });
  };
}]);

angular.module('bhcmartApp').controller('ManageRegistryListController', ['$scope', '$stateParams', '$state', 'Registry', 'Auth', function ($scope, $stateParams, $state, Registry, Auth) {
  var q = { where: { username: Auth.getCurrentUser().email } };
  $scope.registries = Registry.query(q);
}]);
angular.module('bhcmartApp').controller('inviteRegistryCtrl', function ($scope, $rootScope, $state, $stateParams, Registry, Auth, $location, $uibModalInstance) {

  $scope.url = 'http://www.wrapsytest.com' + $location.path();
  console.log($location.path());

  $scope.cancel = function () {
    $uibModalInstance.dismiss('Close');
  };
  $scope.ok = function (wishlistid) {
    $uibModalInstance.close('ok');
  };
});

angular.module('bhcmartApp').controller('ManageRegistryController', ['$scope', '$stateParams', '$state', 'Registry', '$filter', function ($scope, $stateParams, $state, Registry, $filter) {

  $scope.clear = function () {
    $scope.registry.date = null;
  };

  $scope.save = function (form) {
    console.log(form.$valid);
    if (form.$valid) {
      Registry.update($scope.registry, function (resp) {

        $state.go('registry', { id: resp._id });
      }, function (err) {
        console.log(err);
      });
    }
  };

  $scope.viewRegistry = function () {
    $state.go('registry', { id: $scope.registry._id });
  };
  $scope.clear = function () {
    $scope.registry.date = null;
  };

  $scope.open1 = function () {
    $scope.popup1.opened = true;
  };
  $scope.popup1 = { opened: false };

  $scope.options = {
    minDate: new Date()
  };

  $scope.setDate = function (year, month, day) {
    $scope.registry.date = new Date(year, month, day);
  };

  $scope.registry = Registry.get({ id: $stateParams.id }, function (resp) {

    console.log(resp.date);
    var date = new Date(resp.date);
    console.log(date.getFullYear());
    $scope.setDate(date.getFullYear(), date.getMonth(), date.getDate());

    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  });
}]);
//# sourceMappingURL=registry.controller.js.map
