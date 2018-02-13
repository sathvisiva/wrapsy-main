'use strict';

angular.module('bhcmartApp')
.controller('ManageCategoriesCtrl', ['$scope', 'Catalog', 'Modal',
  function($scope, Catalog, Modal) {
    Catalog.query(function(categories) {
      $scope.categories = categories;
      console.log($scope.categories);
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

.controller('ManageCategoriesEditCtrl', ['$scope', '$state', 'Catalog', '$stateParams','Filter','Upload',
  function($scope, $state, Catalog, $stateParams,Filter,Upload) {

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

  Catalog.query(function(categories) {
    $scope.categories = categories;
    $scope.category = Catalog.get({ id: $stateParams.id },function(category){
      $scope.imageUrl = $scope.category.imageUrl;
    });

    console.log($scope.imageUrl)
  });

  Filter.query(function(data) {
    console.log(data)
    $scope.filters = data;
  });

  $scope.save = function(form) {
    if (form.$valid) {
      console.log($scope.category)
      if ($scope.category.slug == 'all') return;
      Catalog.update({ id: $scope.category._id }, $scope.category, function(resp) {
        console.log('updated', resp);
        $state.go('admin.categories');
      }, function(err) {
        console.log(err);
      });
    }
  }
}
])

.controller('ManageCategoriesAddCtrl', ['$scope', '$state', 'Catalog', '$stateParams','Filter','Upload','UploadImage',
  function($scope, $state, Catalog, $stateParams,Filter,Upload,UploadImage) {

    Catalog.query(function(categories) {
      $scope.categories = categories;
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

    $scope.removeImage = function(imageUrl){
      var query = {};
      query.url = $scope.category.imageUrl
      UploadImage.query(query ,function(res){
        console.log(res)
      })
    }

    Filter.query(function(data) {
      console.log(data)
      $scope.filters = data;
    });

    $scope.save = function(form) {
      if (form.$valid) {
        console.log($scope.category)
        Catalog.save($scope.category, function(resp) {
          console.log('created', resp);
          $state.go('admin.categories');
        }, function(err) {
          console.log(err);
          $scope.message == err;
        });
      }
    }
  }
  ]);
