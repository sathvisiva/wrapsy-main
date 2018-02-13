'use strict';

angular.module('bhcmartApp')
.controller('ManageHomeCtrl', ['$scope', '$state',  '$stateParams','Home','Catalog',
	function($scope, $state,  $stateParams, Home, Catalog) {

		$scope.homeimages = function(){
			Home.gethompageImg(function(resp) {
				console.log('images', resp);
				$scope.homeImages = resp;
			}, function(err) {
				console.log(err);
				$scope.message == err;
			});
		}

   $scope.popImages = function(){
    Home.getpopularCat(function(resp) {
     console.log('images', resp);
     $scope.popularcat = resp;
   }, function(err) {
     console.log(err);
     $scope.message == err;
   });
  }

  $scope.homeimages();
  $scope.popImages();


  Catalog.query(function(categories) {
   $scope.categories = categories;

 });





  $scope.deleteImage = function(id) {
   Home.delhompageImg({id : id }, function(resp){
    $scope.homeimages();
  })
 }

 $scope.deletepopCat = function(id) {
   Home.delpopImg({id : id }, function(resp){
    $scope.popImages();
  })
 }


}
])
.controller('ManageHomePageImgAddCtrl', ['$scope', '$state', 'Home', '$stateParams','Upload',
	function($scope, $state, Home, $stateParams, Upload) {


		$scope.upload = function(file, errfile) {

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

        });
			};
		}



    $scope.save = function(form) {

     if (form.$valid) {
      console.log($scope.homeimage)
      Home.createhompageImg($scope.homeimage, function(resp) {
       console.log('created', resp);
       $state.go('admin.managehome');
     }, function(err) {
       console.log(err);
       $scope.message == err;
     });
    }
  }
}
])

.controller('ManagePopularCategoriesAddCtrl', ['$scope', '$state', 'Home', '$stateParams','Catalog','Upload',
  function($scope, $state, Home, $stateParams, Catalog,Upload) {


    $scope.upload = function(file, errFiles) {
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
          $state.go('admin.managehome');
        }, function(err) {
          console.log(err);
          $scope.message == err;
        });
      }
    }
  }
  ]);

