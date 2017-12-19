'use strict';

angular.module('bhcmartApp')
.controller('ManageCategoriesCtrl', ['$scope', 'Catalog', 'Modal',
  function($scope, Catalog, Modal) {






    Catalog.query(function(categories) {
      $scope.categories = categories;
        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.categories.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });

    $scope.deleteCatalog = Modal.confirm.delete(function(c) {
      if (c.slug == 'all') return;
      c.$remove(c._id, function(resp) {
        console.log(resp)
        $scope.categories.splice($scope.categories.indexOf(c), 1);
      })
    });
  }
  ])

.controller('ManageCategoriesEditCtrl', ['$scope', '$state', 'Catalog', '$stateParams','Upload',
  function($scope, $state, Catalog, $stateParams, Upload) {

    Catalog.query(function(categories) {
      $scope.categories = categories;
      $scope.category = Catalog.get({ id: $stateParams.id });
    });

    $scope.upload = function(file) {
      if (file) {
        Upload.upload({
          url: '/api/uploads',
          data: { file: file }
        }).then(function(resp) {
          if ($scope.category) {

            $scope.category.imageUrl = resp.data.url;

          } else {
            $scope.category = { imageUrl: resp.data.imageUrl }
          }
          console.log(resp.data);
        }, function(resp) {
          $scope.errorMsg = resp.status + ': ' + resp.data;
        }, function(evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          });
      };
    }

    $scope.save = function(form) {
      if (form.$valid) {
        Catalog.update({ id: $scope.category._id }, $scope.category, function(resp) {
          console.log('updated', resp);
          $state.go('adminconsole.manage-categories');
        }, function(err) {
          console.log(err);
        });
      }
    }
  }
  ])

.controller('ManageCategoriesAddCtrl', ['$scope', '$state', 'Catalog', '$stateParams','Upload',
  function($scope, $state, Catalog, $stateParams, Upload) {

    Catalog.query(function(categories) {
      $scope.categories = categories;
    });
    $scope.options1 = []
    
    for (var i = 0; i < 10; i++) {
      $scope.options1.push({ key: i + 1, value: 'Prop' + (i + 1).toString() });
    }

    $scope.option1 = [3,5,7];
    $scope.upload = function(file) {
      if (file) {
        Upload.upload({
          url: '/api/uploads',
          data: { file: file }
        }).then(function(resp) {
          if ($scope.category) {

            $scope.category.imageUrl = resp.data.url;

          } else {
            $scope.category = { imageUrl: resp.data.imageUrl }
          }
          console.log(resp.data);
        }, function(resp) {
          $scope.errorMsg = resp.status + ': ' + resp.data;
        }, function(evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          });
      };
    }

    $scope.save = function(form) {
      if (form.$valid) {
        console.log($scope.category)
        Catalog.save($scope.category, function(resp) {
          console.log('created', resp);
          $state.go('adminconsole.manage-categories');
        }, function(err) {
          console.log(err);
          $scope.message == err;
        });
      }
    }
  }
  ])

.controller('ManageFeaturesCtrl', ['$scope', 'Features', 'Modal',
  function($scope, Features, Modal) {
    Features.query(function(features) {
      $scope.features = features;
        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.features.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });

    $scope.deleteFeatures = Modal.confirm.delete(function(c) {
      if (c.slug == 'all') return;
      c.$remove(c._id, function(resp) {
        console.log(resp)
        $scope.features.splice($scope.features.indexOf(c), 1);
      })
    });
  }
  ])

.controller('ManageFeaturesEditCtrl', ['$scope', '$state', 'Features', '$stateParams',
  function($scope, $state, Features, $stateParams) {

    Features.query(function(features) {
      $scope.features = features;
      $scope.feature = Features.get({ id: $stateParams.id });
    });

    $scope.save = function(form) {
      if (form.$valid) {
        Features.update({ id: $scope.feature._id }, $scope.feature, function(resp) {
          console.log('updated', resp);
          $state.go('adminconsole.manage-features');
        }, function(err) {
          console.log(err);
        });
      }
    }
  }
  ])

.controller('ManageFeaturesAddCtrl', ['$scope', '$state', 'Features', '$stateParams',
  function($scope, $state, Features, $stateParams) {

    Features.query(function(features) {
      $scope.features = features;
    });   

    $scope.save = function(form) {
      if (form.$valid) {
        console.log($scope.features)
        Features.save($scope.features, function(resp) {
          console.log('created', resp);
          $state.go('adminconsole.manage-features');
        }, function(err) {
          console.log(err);
          $scope.message == err;
        });
      }
    }
  }
  ]);
