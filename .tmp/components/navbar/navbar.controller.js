'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var NavbarController =
//end-non-standard

function NavbarController(Auth, Catalog, $scope, $mdDialog, $state, $stateParams, $mdMedia, NavbarService, $uibModal) {
  _classCallCheck(this, NavbarController);

  this.isCollapsed = true;

  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  $scope.showSearch = false;

  $scope.toggleSearch = function () {
    if ($scope.showSearch) {
      $scope.showSearch = false;
    } else {
      $scope.showSearch = true;
    }
  };

  $scope.getcategories = function (parentid) {
    var q = { where: { parent: parentid } };
    return Catalog.query(q);
  };

  $scope.openCart = function (ev) {
    if ($scope.isLoggedIn()) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/cart/cart.html',
        controller: 'CartCtrl',
        size: 'lg'
      });
    } else {
      $scope.data = { 'state': 'cart', 'event': 'login' };
      $scope.login(ev, $scope.data);
    }
  };
  /*
      $scope.buildnavbar = function(){
        $scope.tree = [];
        Catalog.query(function(categories) {
          $scope.categories = categories;
    
          $scope.parentCategories = _.filter(categories, function(category) {
            return category.ancestors.length == 1;
          });
  
          console.log($scope.parentCategories);
  
          angular.forEach($scope.parentCategories, function(value, key){
  
            var parentcateogry = {
              "name" : value.name,
              "slug" : value.slug,
              "id" : value._id
            }
            if(value.children.length > 0){
              parentcateogry.subtree = [];
              angular.forEach(value.children, function(id, key){
                $scope.subCategories = _.filter($scope.categories, function(category) {
                  return category._id == id;
                })
  
                if($scope.subCategories.length>0){
                  var subcategory = {
                    "name" : $scope.subCategories[0].name,
                    "slug" : $scope.subCategories[0].slug,
                    "id" : $scope.subCategories[0]._id
  
                  }
                  if($scope.subCategories[0].children && $scope.subCategories[0].children.length > 0){
                    subcategory.subtree = [];
                    angular.forEach($scope.subCategories[0].children, function(id, key){
                      $scope.subsubCategories = _.filter($scope.categories, function(category) {
                        return category._id == id;
                      })
  
                      if($scope.subsubCategories.length>0){
                        var subsubcategory = {
                          "name" : $scope.subsubCategories[0].name,
                          "slug" : $scope.subsubCategories[0].slug,
                          "id" : $scope.subsubCategories[0]._id
  
                        }
                        subcategory.subtree.push(subsubcategory)
                      }
  
  
  
  
                    })
  
                  }
  
                }
  
                parentcateogry.subtree.push(subcategory)
              })
  
            }
            $scope.tree.push(parentcateogry);
          });
        });
      }*/

  /*$scope.buildnavbar();*/

  $scope.tree = NavbarService.createnav();

  $scope.showsubtree = false;

  $scope.showsusubtree = false;

  $scope.expandsubtree = function () {
    $scope.showsubtree = !$scope.showsubtree;
  };

  $scope.expandsusubtree = function () {
    $scope.showsusubtree = !$scope.showsusubtree;
  };

  $scope.openNav = function () {
    console.log("inside openNav");
    document.getElementById("mySidenav").style.width = "250px";
  };

  $scope.closeNav = function () {
    console.log("inside closenav");
    document.getElementById("mySidenav").style.width = "0";
  };

  /*function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }*/
  /*
      function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
      }*/

  $scope.createRegistry = function (ev) {
    if ($scope.isLoggedIn()) {
      $state.go('createregistry.registryType');
    } else {
      $scope.data = { 'state': 'createregistry.registryType', 'event': 'login' };
      $scope.login(ev, $scope.data);
    }
  };

  $scope.login = function (ev, data) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
    $mdDialog.show({
      controller: 'LoginController',
      templateUrl: 'app/account/login/login.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      fullscreen: useFullScreen,
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
};

angular.module('bhcmartApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=navbar.controller.js.map
