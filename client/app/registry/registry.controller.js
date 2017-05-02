'use strict';

(function() {

  class CreateRegistryController {

    constructor($http, $scope, $timeout, socket, Registry,$uibModal,$state, Auth,$stateParams,RegistryService) {
  	
    this.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.state = $state.current
    $scope.params = $stateParams; 
    $scope.type = $scope.params.type;
    $scope.registry = {}
    $scope.registry.type = $scope.type
    
    $scope.save = function(form) {
    	console.log(form.$valid)
        if (form.$valid) {
          console.log($scope.getCurrentUser())
      		$scope.registry.username = $scope.getCurrentUser().email
      		$scope.registry.backgroundImageUrl = 'assets/img/cover.jpg'
          $scope.registry.profileImageUrl = 'assets/img/noimage.jpg'          
      		 Registry.save($scope.registry, function(resp) {
            var registrydata = {}
            registrydata._id = resp._id
            registrydata.title = resp.title
            RegistryService.addregistry(registrydata)
            $state.go('registry', {id: resp._id});
          }, function(err) {
            console.log(err)
          })
        }
      }


  	
  

  $scope.clear = function() {
    $scope.registry.date = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  

 

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  

  $scope.setDate = function(year, month, day) {
    $scope.registry.date = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  


  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
 
    }
  }

  angular.module('bhcmartApp')
    .controller('CreateRegistryController', CreateRegistryController);

})();

angular.module('bhcmartApp')
  .controller('RegistryController', ['$scope', '$stateParams', '$state', 'Registry','$uibModal','Upload','RegistryService','Auth',
    function($scope, $stateParams, $state,  Registry,$uibModal, Upload, RegistryService , Auth) {
    
      
      $scope.registryList = true

      $scope.changegeview = function(){
        $scope.registryList = false
      }
      $scope.changegeview1 = function(){
        $scope.registryList = true
      }

       $scope.updatedesired = function(){
    Registry.update({id:$scope.registry._id},$scope.registry).$promise.then(function(res) {

    });
  }

      $scope.saversvp = function(form) {
      console.log(form.$valid)
        if (form.$valid) {
          console.log($scope.rsvp)
          $scope.rsvp.registryId = $scope.registry._id
          console.log($scope.rsvp)
            Registry.rsvpRegistry({ id: $scope.registry._id }, $scope.rsvp, function(resp) {
          console.log("success")
        }, function(err) {
          console.log(err)
          $scope.message = "An error occured!"
        });
        }
      }



      $scope.registry = Registry.get({ id: $stateParams.id }, function(resp) {
          if(Auth.getCurrentUser().email == resp.username){
            $scope.editable = true
          }
          
          console.log($scope.editable)
          var registrydata = {}
            registrydata._id = resp._id
            registrydata.title = resp.title
            RegistryService.addregistry(registrydata)
      });

      $scope.selectBackgroundImage = function(){
        var modalInstance = $uibModal.open({
          templateUrl : 'app/registry/backgroundImages.html',
          controller: 'backgroundImageCtrl',
          size :'lg'
        })
        .result.then(function(result) {
                $scope.registry.backgroundImageUrl = result;
                Registry.update({id:$scope.registry._id},$scope.registry).$promise.then(function(res) {
            console.log("success")
          });
        });
         /* $scope.registry.backgroundImageUrl = "assets/img/cover.jpg"
    		 */
    	}

      $scope.productDetail = function(product){
        var modalInstance = $uibModal.open({
          templateUrl : 'app/registry/registry-product.html',
          controller: 'RegistryProductDetailCtrl',
          size :'md',
          resolve: {
          registry: function () {
           return $scope.registry._id;
         },registryprod : function(){
          return  product;
        }
      }
        })
        .result.then(function(result) {
           
        });
         /* $scope.registry.backgroundImageUrl = "assets/img/cover.jpg"
         */
      }

      $scope.setVisible = function(){
        $scope.registry.visible = true;
          Registry.update({id:$scope.registry._id},$scope.registry).$promise.then(function(res) {
            console.log("success")
          });

      }

      $scope.upload = function(file) {
        if (file) {
          Upload.upload({
            url: '/api/uploads',
            data: { file: file }
          }).then(function(resp) {
            if ($scope.registry) {

              $scope.registry.profileImageUrl = resp.data.url;

              Registry.update({id:$scope.registry._id},$scope.registry).$promise.then(function(res) {
                console.log("success")
              });
            } else {
              $scope.registry = { profileImageUrl: resp.data.imageUrl }
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



    }
  ]);

angular.module('bhcmartApp')
  .controller('backgroundImageCtrl', ['$scope', '$stateParams', '$state', 'Registry','$uibModalInstance',
    function($scope, $stateParams, $state,  Registry, $uibModalInstance) {
    
      

       $scope.ok = function(imageUrl) {
        $uibModalInstance.close(imageUrl);  
        };

        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };

    }
  ]);

  angular.module('bhcmartApp')
  .controller('RegistryProductDetailCtrl', ['$scope', '$stateParams', '$state', 'Registry','$uibModalInstance','registry','registryprod','Product','ngCart',
    function($scope, $stateParams, $state,  Registry, $uibModalInstance,registry,registryprod,Product,ngCart) {
      
      $scope.registryid = registry
      $scope.registryprod = registryprod;

       $scope.addtocart = function(){
          console.log("test")
        ngCart.addItem($scope.product._id, $scope.product.title, $scope.product.price, $scope.qty,$scope.registryid ,$scope.product)
        $uibModalInstance.close();  
      }
      
     $scope.product = Product.get({ id: registryprod.slug });

       $scope.ok = function() {
        $uibModalInstance.close();  
        };


        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };

    }
  ]);
angular.module('bhcmartApp')
  .controller('FindRegistryController', ['$scope', '$stateParams', '$state', 'Registry',
    function($scope, $stateParams, $state,  Registry) {
    
      $scope.searchRegistry = function(){
          
        var q = {where:{title: {'$regex': $scope.input}}};
        q.where.title.$options ="$i";
        $scope.registries = Registry.query(q,function(data){
              console.log(data);
         });


    }
  }
  ]);

angular.module('bhcmartApp')
  .controller('ManageRegistryListController', ['$scope', '$stateParams', '$state', 'Registry','Auth',
    function($scope, $stateParams, $state,  Registry,Auth) {
    var q = {where:{username:Auth.getCurrentUser().email}};

      $scope.registries =  Registry.query(q);
  }
  ]);

angular.module('bhcmartApp')
  .controller('ManageRegistryController', ['$scope', '$stateParams', '$state', 'Registry','$filter',
    function($scope, $stateParams, $state,  Registry, $filter) {
     
      $scope.clear = function() {
    $scope.registry.date = null;
  };

  $scope.save = function(form) {
      console.log(form.$valid)
        if (form.$valid) {
  Registry.update($scope.registry, function(resp) {
            
            $state.go('registry', {id: resp._id});
          }, function(err) {
            console.log(err)
          })
}
}

$scope.viewRegistry = function(){
  $state.go('registry', {id: resp._id});
}

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  

 

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  

  $scope.setDate = function(year, month, day) {
    $scope.registry.date = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  


  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

    $scope.setDate = function(year, month, day) {
    $scope.registry.date = new Date(year, month, day);
  };

      $scope.registry = Registry.get({ id: $stateParams.id }, function(resp) {
          
          console.log(resp.date)
          var date = new Date(resp.date);
          console.log(date.getFullYear())
          $scope.setDate(date.getFullYear(),date.getMonth(),date.getDate() )
          
date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
      });
      

      
      

  
  }
  ]);





