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

    $scope.setDate = function(year, month, day) {
      $scope.registry.date = new Date(day , month,year );
    };

    var date = new Date();
    $scope.setDate(date.getFullYear(),date.getMonth(),date.getDate() )
  	







  $scope.registry.date = new Date();

  $scope.clear = function() {
    $scope.registry.date = null;
  };

   $scope.open1 = function () { $scope.popup1.opened = true; };
    $scope.popup1 = { opened: false };

    $scope.options = {
      minDate: new Date(),
    }

 
  }
}

  angular.module('bhcmartApp')
    .controller('CreateRegistryController', CreateRegistryController);

})();

angular.module('bhcmartApp')
  .controller('RegistryController', ['$scope', '$stateParams', '$state', 'Registry','$uibModal','Upload','RegistryService','Auth','toaster','$timeout',
    function($scope, $stateParams, $state,  Registry,$uibModal, Upload, RegistryService , Auth, toaster,$timeout) {
    
     $scope.removeProduct = function(pid){
     for (var i = $scope.registry.products.length - 1; i >= 0; i--) {
      if ($scope.registry.products[i]._id == pid) {
        $scope.registry.products.splice(i, 1);
      }
    }
    Registry.update({id:$scope.registry._id},$scope.registry).$promise.then(function(res) {
      $scope.registry = res
      toaster.pop('success', "Product successfully deleted");
    });
  }


    $scope.queryRegistry = function(){

      $scope.registry = Registry.get({ id: $stateParams.id }, function(resp) {
          if(Auth.getCurrentUser().email == resp.username){
            $scope.editable = true
          }
            var registrydata = {}
            registrydata._id = resp._id
            registrydata.title = resp.title
            RegistryService.addregistry(registrydata)
      });
    }

$scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;


      $scope.queryRegistry()

      $scope.show1 = true
      $scope.show2 = false
      $scope.show3 = false
      $scope.show4 = false

      $scope.showWishlist = function(){
        $scope.show1 = true
        $scope.show2 = false
        $scope.show3 = false
        $scope.show4 = false
      }
      $scope.showRSVP = function(){
        $scope.show1 = false
        $scope.show2 = true
        $scope.show3 = false
        $scope.show4 = false
        $scope.rsvp = {}
        $scope.rsvp.attending = "true"
      }

      $scope.showGuestBook = function(){
        $scope.show1 = false
        $scope.show2 = false
        $scope.show3 = true
        $scope.show4 = false
        $scope.getGuestWishes()
      }

      $scope.showGuests = function(){
        $scope.show1 = false
        $scope.show2 = false
        $scope.show3 = false
        $scope.show4 = true;
        $scope.getGuestList()
        
      }

      $scope.updatedesired = function(){
        Registry.update({id:$scope.registry._id},$scope.registry).$promise.then(function(res) {
          $scope.registry = res;
          toaster.pop('success', "Product desired count updated");
        });
      }

      $scope.saversvp = function(form) {
      
        if (form.$valid) {
        console.log($scope.rsvp)
        $scope.rsvp.registryId = $scope.registry._id
        Registry.rsvpRegistry({ id: $scope.registry._id }, $scope.rsvp, function(resp) {
          toaster.pop('success', "Thank you for your Response");
          $timeout(function() {
            $scope.showWishlist()
          }, 1000);
        }, function(err) {
          
          toaster.pop('error', "Some error occured");
        });
        } 
      }

        $scope.saveGuestWish = function(form) {
      
        if ($scope.guestbook.by && $scope.guestbook.wishes) {
        $scope.guestbook.registryId = $scope.registry._id
        Registry.guestBookRegistry({ id: $scope.registry._id }, $scope.guestbook, function(resp) {
          toaster.pop('success', "Thank you for sharing your wishes");
          $scope.guestbook.wishes = ""
          $scope.guestbook.by = ""
          $scope.getGuestWishes()
        }, function(err) {
          
          toaster.pop('error', "Some error occured");
        });
        }
      }

      $scope.getGuestWishes = function(){
        
        $scope.guestWishes =  Registry.registryGuestBook({ id: $scope.registry._id });
        console.log($scope.guestWishes)
       /*  Registry.registryGuestBook({ id: $scope.registry._id }, function(resp) {
            $scope.guest.guestWishes = resp;
            console.log($scope.guest.guestWishes)
            
        }, function(err) {
          
          toaster.pop('error', "Some error occured");
        });*/
        


      }


      $scope.getGuestList = function(){
        $scope.guests = Registry.registryGuest({ id: $scope.registry._id });
      }


      $scope.inviteFriends = function(){
        var modalInstance = $uibModal.open({
          templateUrl : 'app/registry/invite.html',
          controller: 'inviteRegistryCtrl',
          size :'md'
        })
        .result.then(function(result) {
               
        });
         /* $scope.registry.backgroundImageUrl = "assets/img/cover.jpg"
         */
      }
    

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
          console.log(result)
           $scope.queryRegistry()
        });
     /* }*/
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

       $scope.addtocart = function(qty){

        ngCart.addItem($scope.product._id, $scope.product.title, $scope.product.price, qty ,$scope.product,$scope.registryid)
        $uibModalInstance.close();  
      }

      $scope.buyNow = function(qyt){
        $uibModalInstance.close("test");  
        Registry.updatePdtcnt({ id: $scope.registryid  }, $scope.product, function(resp) {
           
        }, function(err) {
          console.log(err)
          $scope.message = "An error occured!"
        });

      }
    


     $scope.product = Product.get({ id: registryprod.slug });




     




     $scope.max = parseInt(registryprod.desired) - parseInt(registryprod.required)

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
        $scope.display = false;
        var q = {where:{title: {'$regex': $scope.input}}};
        q.where.title.$options ="$i";
        $scope.registries = Registry.query(q,function(data){
              
              var groupArrayNew = [];

          angular.forEach(data, function (item, idx) {
              if (item.visible)
              groupArrayNew.push(item)
          });
           if(groupArrayNew.length == 0){
              console.log("inside loog")
              $scope.display = true;
              console.log($scope.display)
            }



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
.controller('inviteRegistryCtrl',function ($scope,$rootScope,$state, $stateParams,Registry,Auth,$location, $uibModalInstance) {

 $scope.url = 'http://www.wrapsytest.com'+$location.path();
 console.log($location.path());

 $scope.cancel = function () {
  $uibModalInstance.dismiss('Close');
};
$scope.ok = function (wishlistid) {
  $uibModalInstance.close('ok');
};

});

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
  $state.go('registry', {id: $scope.registry._id});
}
    $scope.clear = function() {
    $scope.registry.date = null;
  };

   $scope.open1 = function () { $scope.popup1.opened = true; };
    $scope.popup1 = { opened: false };

    $scope.options = {
      minDate: new Date(),
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





