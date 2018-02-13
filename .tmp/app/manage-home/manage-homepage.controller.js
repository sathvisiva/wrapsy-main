"use strict";

/*'use strict';

angular.module('bhcmartApp')
.controller('ManageHomePageCtrl', ['$scope', 'Home', 'Modal','Catalog',
  function($scope, Home, Modal,Catalog) {


   Home.GethompageImg(function(resp) {
    console.log('images', resp);
    $scope.homeImages = resp;
  }, function(err) {
    console.log(err);
    $scope.message == err;
  });

   Catalog.query(function(categories) {
    $scope.categories = categories;

  });


   Home.GetpopularCat(function(resp) {
    console.log('images', resp);
    $scope.popularcat = resp;
  }, function(err) {
    console.log(err);
    $scope.message == err;
  });



   $scope.deleteImage = function(id) {
    Home.DelhompageImg({id : id }, function(resp){
      console.log(resp)
    })
  }

  $scope.deletepopCat = function(id) {
    Home.DelpopularCat({id : id }, function(resp){
      console.log(resp)
    })
  }
}
])


.controller('ManageHomePageImgAddCtrl', ['$scope', '$state', 'Home', '$stateParams','Upload',
  function($scope, $state, Home, $stateParams, Upload) {

    $scope.upload = function(file) {
      if (file) {
        Upload.upload({
          url: '/api/uploads',
          data: { file: file }
        }).then(function(resp) {
          if ($scope.homeimage) {

            $scope.homeimage.imageUrl = resp.data.url;

          } else {
            $scope.homeimage = { imageUrl: resp.data.imageUrl }
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
        console.log($scope.homeimage)
        Home.createhompageImg($scope.homeimage, function(resp) {
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


.controller('ManagePopularCategoriesAddCtrl', ['$scope', '$state', 'Home', '$stateParams','Catalog',
  function($scope, $state, Home, $stateParams, Catalog) {


    $scope.upload = function(file) {
      if (file) {
        Upload.upload({
          url: '/api/uploads',
          data: { file: file }
        }).then(function(resp) {
          if ($scope.popimage) {

            $scope.popimage.imageUrl = resp.data.url;

          } else {
            $scope.popimage = { imageUrl: resp.data.imageUrl }
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

  });  

    $scope.save = function(form) {
      if (form.$valid) {
        console.log($scope.popimage)
        Home.createpopularCat($scope.popimage, function(resp) {
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
*/
//# sourceMappingURL=manage-homepage.controller.js.map
