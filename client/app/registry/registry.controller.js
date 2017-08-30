'use strict';

(function() {

  class CreateRegistryController {

    constructor($http, $scope, $timeout, Registry,$uibModal,$state, Auth,$stateParams,RegistryService, Address) {

      $scope.disableevent = true;
      $scope.disablelocation = true ; 
      $scope.disablemessage = true;
      $scope.enableSecondName = false;
      $scope.eventformsubmitted = false;
      $scope.locationformsubmitted = false;
      this.isLoggedIn = Auth.isLoggedIn;
      $scope.getCurrentUser = Auth.getCurrentUser;
      $scope.phoneNumbr = /^\+?\d{2}\d{3}\d{5}$/;
      $scope.registry = {}
      $scope.address = {}

      $scope.eventType = function(type){
        $scope.registry.type = type;
        if($scope.registry.type == 'wedding'){
          $scope.enableSecondName = true;
        }
        $scope.disableevent = false;
        $state.go('createregistry.eventDetails');
        console.log($scope.registry);
      }

      $scope.saveeventdetails = function(form){
        $scope.eventformsubmitted = false;
        if (!form.$valid) {
          $scope.eventformsubmitted = true
        }else{
          $scope.disablelocation = false;
          $state.go('createregistry.location');
          console.log($scope.registry);
        }

      }

      $scope.savelocation = function(form){
        $scope.locationformsubmitted = false;
        if (!form.$valid) {
          $scope.locationformsubmitted = true
        }else{
          $scope.disablemessage = false;
          $state.go('createregistry.message');
        }

      }

      $scope.registryType = function(state){
        $scope.state = 'createregistry.'+state;
        $state.go($scope.state);

      }

      $scope.save = function(form) {
       console.log(form.$valid)
       if (form.$valid) {
        console.log($scope.getCurrentUser())
        $scope.registry.username = $scope.getCurrentUser().email;
        $scope.registry.theme = 'theme1'
        //$scope.registry.backgroundImageUrl = 'assets/img/cover.jpg'
        $scope.registry.profileImageUrl = 'assets/img/noimage.jpg'          
        Registry.save($scope.registry, function(resp) {
          $scope.address.registryId = resp._id
          Address.save($scope.address, function(resp) {

          }, function(err) {
            console.log(err)
          })
          $state.go('registry.home', {id: resp._id});
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
.controller('RegistryController', ['$scope', '$stateParams', '$state', 'Registry','$uibModal','Upload','RegistryService','Auth','toaster','$timeout','$mdDialog',
  function($scope, $stateParams, $state,  Registry,$uibModal, Upload, RegistryService , Auth, toaster,$timeout,$mdDialog) {



    $scope.form = {};

    $scope.setTheme = function(selectedthem){
      $scope.theme = $scope.selectedthem;
      console.log($scope.theme)
    }

    $scope.queryRegistry = function(){

      $scope.registry = Registry.get({ id: $stateParams.id }, function(resp) {
        console.log(resp);
        if(Auth.getCurrentUser().email == resp.username){
          $scope.editable = true
        }
        $scope.setTheme($scope.registry.theme);
        console.log($scope.theme);
      });
    }


    $scope.queryRegistry();




    $scope.registry.theme1 = {
      "background": "theme1background",
      "color" : "theme1color",
      "title" : "theme1tilte",
      "font" : "theme1font"
    }

    $scope.registry.theme2 = {
      "background": "theme2background",
      "color" : "theme2color",
      "title" : "theme1tilte",
      "font" : "theme1font"
    }

    




    $scope.registryPage = function(state){
      $scope.state = 'registry.'+state;
      if(state == 'guestbook'){
        $scope.guestbook = {};
        $scope.getGuestWishes();
      }
      if(state == 'accomodation'){
        $scope.accomodation = {};
        $scope.getAccomodations();
      }
      console.log($scope.registry)
      $state.go($scope.state);
    }

    $scope.removeProduct = function(event, pid) {
     var confirm = $mdDialog.confirm()
     .title('Are you sure to delete the Product?')
     .textContent('Product will be deleted permanently from the registry.')
     .ariaLabel('Product deletion')
     .targetEvent(event)
     .ok('Yes')
     .cancel('No');
     $mdDialog.show(confirm).then(function() {
      $scope.removeProductfromregistry(pid)
    }, function() {
      $scope.status = 'You decided to keep your record.';
    });
   };


   $scope.removeProductfromregistry = function(pid){
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






  $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;

  $scope.rsvp = {};

  $scope.updatedesired = function(){
    Registry.update({id:$scope.registry._id},$scope.registry).$promise.then(function(res) {
      $scope.registry = res;
      toaster.pop('success', "Product desired count updated");
    });
  }

  $scope.saversvp = function(form) {


    if (form.$valid) {
      console.log($scope.registry._id)
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
      console.log($scope.guestbook);
      console.log($scope.registry._id);
      Registry.guestBookRegistry({ id: $scope.registry._id }, $scope.guestbook, function(resp) {
        toaster.pop('success', "Thank you for sharing your wishes");
        $scope.guestbook = {};
        form.$setPristine();
        form.$setUntouched();
        $scope.getGuestWishes()
      }, function(err) {

        toaster.pop('error', "Some error occured");
      });
    }
  }

  $scope.saveaccomodation = function(form) {


    $scope.accomodation.registryId = $scope.registry._id
    Registry.accomodation({ id: $scope.registry._id }, $scope.accomodation, function(resp) {
      toaster.pop('success', "Thank you for sharing accomodation details");
      form.$setPristine();
      form.$setUntouched();
      $scope.accomodation = {};
      $scope.getAccomodations()
    }, function(err) {

      toaster.pop('error', "Some error occured");
    });
    
  }

  $scope.getAccomodations = function(){
    $scope.accomodations = Registry.accomodationDetails({ id: $scope.registry._id })
    console.log($scope.accomodations);
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
          var blob = dataURItoBlob(result);
          var file = new File([blob], 'fileName.jpeg', {type: "'image/jpeg"});
          $scope.upload(file)

        });

      }

      $scope.selectTheme = function(){
        var modalInstance = $uibModal.open({
          templateUrl : 'app/registry/registry-themes.html',
          controller: 'themeCtrl',
          size :'lg'
        })
        .result.then(function(result) {
         console.log(result);
       });

      }

      function dataURItoBlob(dataURI) {

            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
              byteString = atob(dataURI.split(',')[1]);
            else
              byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
          }


          $scope.showproductDetail = function(product, chipin){
            console.log(product);
            if(chipin){
              $scope.chipinProductDetail(product);
            }else{
              $scope.productDetail(product);
            }

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
            }, function() {
  // Cancel
});
          }

          $scope.chipinProductDetail = function(product){  
            var modalInstance = $uibModal.open({
              templateUrl : 'app/registry/registry-chipinproduct.html',
              controller: 'RegistryChipinProductDetailCtrl',
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
            }, function() {
  // Cancel
});
            /* }*/
         /* $scope.registry.backgroundImageUrl = "assets/img/cover.jpg"
         */
       }


       $scope.addCustomProduct = function(){  
        var modalInstance = $uibModal.open({
          templateUrl : 'app/registry/registry-custompdt.html',
          controller: 'RegistryCustomProductDetailCtrl',
          size :'md',
          resolve: {
            registry: function () {
             return $scope.registry._id;
           }
         }
       })
        .result.then(function(result) {
          console.log(result)
          $scope.queryRegistry()
        }, function() {
  // Cancel
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
            console.log(resp)
            if ($scope.registry) {

              $scope.registry.profileImageUrl = resp.data.url;

              Registry.update({id:$scope.registry._id},$scope.registry).$promise.then(function(res) {
                console.log(res);
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


    $scope.myCroppedImage='';
    $scope.myImage= '';

    $scope.upload = function(file) {
      var selectedfile=file;
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);

    }    



    $scope.myCroppedImage = '';

    $scope.Withoutcrop = function(){
      $uibModalInstance.close($scope.myImage); 
    }


    $scope.crop = function(){
      $uibModalInstance.close($scope.myCroppedImage); 
    }

  }
  ]);

angular.module('bhcmartApp')
.controller('themeCtrl', ['$scope', '$stateParams', '$state', 'Registry','$uibModalInstance',
  function($scope, $stateParams, $state,  Registry, $uibModalInstance) {



   $scope.ok = function(theme) {
    $uibModalInstance.close(theme);  
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

    console.log(registryprod);

    $scope.qty = 1;

    var q= {};
    q.where = {};
    var f =[];
    f.push({'_id' : $scope.registryid});
    f.push({'products._id': $scope.registryprod._id})
    q.where = { $and : f};


    $scope.BuyProduct = function(product,qty){
      console.log($scope.qty)
      console.log(product);
      var gst = parseInt(product.sgst) + parseInt(product.cgst);
      var gstamount = (parseInt(gst)*parseInt(qty)*parseInt(product.price))/100
      ngCart.addItem(product._id, product.title, product.price, qty, product,$scope.registryprod.color,$scope.registryprod.size,gstamount,$scope.registryid);
      $uibModalInstance.close();  
    }

    $scope.buyNow = function(qyt){
      $uibModalInstance.close("test");  
      if(!$scope.registryprod.custom){
        var buyproduct = $scope.product;
      }else{
        var buyproduct = $scope.registryprod;
      }
      Registry.updatePdtcnt({ id: $scope.registryid  }, buyproduct, function(resp) {
        console.log(resp);
      }, function(err) {
        console.log(err)
        $scope.message = "An error occured!"
      });
    } 
    if(!$scope.registryprod.custom){
      $scope.product = Product.get({ id: registryprod.slug });
    }

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
.controller('RegistryChipinProductDetailCtrl', ['$scope', '$stateParams', '$state', 'Registry','$uibModalInstance','registry','registryprod','Product','ngCart',
  function($scope, $stateParams, $state,  Registry, $uibModalInstance,registry,registryprod,Product,ngCart) {

    $scope.registryid = registry
    $scope.registryprod = registryprod;
    console.log($scope.registryprod);
    $scope.contribution = 100;
    $scope.maxprice = parseInt(registryprod.price);

    $scope.paidPercent = (parseInt(registryprod.price) / parseInt(registryprod.paid))*100;
    $scope.total = parseInt(registryprod.price) * parseInt(registryprod.desired);
    $scope.remaining = parseInt(registryprod.price) - parseInt(registryprod.paid)


    $scope.ok = function() {
     $state.go('contributioncart', {registryId: $scope.registryid, product : $scope.registryprod, contribution : $scope.contribution});
     $uibModalInstance.close();  
   };


   $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

}
]);

angular.module('bhcmartApp')
.controller('RegistryCustomProductDetailCtrl', ['$scope', '$stateParams', '$state', 'Registry','$uibModalInstance','registry','toaster','$timeout','ngCart',
  function($scope, $stateParams, $state,  Registry, $uibModalInstance,registry,toaster,$timeout,ngCart) {

    $scope.registryid = registry;
    $scope.products = {};
    $scope.products.desired = 1;
    $scope.products.desired = 1;


    $scope.save = function(form) {

     if (form.$valid) {      
      $scope.products._id = new Date().getUTCMilliseconds().toString();
      $scope.products.imageUrl = "/assets/img/custom.jpg";
      $scope.products.custom = true;
      console.log($scope.products);
      Registry.registryProduct({ id: $scope.registryid }, $scope.products, function(resp) {
        toaster.pop('success', "Product has been added successfully");
        $timeout(function() {
          $uibModalInstance.close();  
        }, 1000);
      },function(err) {
        console.log(err)
      });
    }
  }

  $scope.contribute = function(registryid, product, contribution){
    $uibModalInstance.close(); 
  }

  $scope.ok = function() {
    $uibModalInstance.close();  
  };


  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

}
]);

angular.module('bhcmartApp')
.controller('contributioncartController', ['$scope', '$stateParams', '$state', 'Payment','Auth','Registry',
  function($scope, $stateParams, $state, Payment, Auth, Registry) {

    console.log($stateParams.registryId);
    console.log($stateParams.product);
    console.log($stateParams.contribution);
    $scope.registryId = $stateParams.registryId;
    $scope.product = $stateParams.product;
    $scope.contributionamount = $stateParams.contribution;

    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    $scope.message = 'Everyone come and see how good I look!';
    $scope.mkey = 'gtKFFx';
    $scope.productInfo = 'Verification order';
    $scope.txnid = makeid();
    $scope.amount = 234.99;
    $scope.id = '2222222';
    $scope.type = '2';
    $scope.email = 'sathvisiva@gmail.com';
    $scope.phone = 9176464641;
    $scope.lastName = 'test';
    $scope.firstName = 'fname';
    $scope.surl = "http://localhost:9000/PaymentStatus";
    $scope.hash = '';

    $scope.presubmit = function () {
      var data = { preHashString: $scope.mkey + '|' + $scope.txnid + '|' + $scope.amount + '|' + $scope.productInfo + '|' + $scope.firstName + '|' + $scope.email + '|' + $scope.id + '||||||||||' };
      Payment.createHash(data, function(resp) {
        document.getElementById('hash').value = resp.hash;
        document.getElementById('contributepaymentForm').submit();
      }, function(err) {
        console.log(err)
      })
    }


    $scope.saveContribution = function(ev){
      $scope.contribution = {};
      if($scope.isLoggedIn()){
        $scope.name = Auth.getCurrentUser().name || {};
        /*$scope.contribution.productId = $scope.product._id;
        $scope.contribution.contribution = $scope.contributionamount;
        $scope.contribution.registryId = $scope.registryId;*/
        $scope.amount = $scope.contributionamount;
        var  prodinfo = $scope.product._id +','+ $scope.contributionamount +',' + $scope.registryId+ ',' + $scope.name;
        $scope.productInfo = prodinfo;
        console.log($scope.productInfo);
        $scope.presubmit();
       /* Registry.contribution($scope.productInfo, function(resp) {
          $scope.amount = resp.amount;
          $scope.productInfo = resp._id;
          $scope.presubmit()
        }, function(err) {
          console.log(err)
        })*/
      }else{
        $scope.data = {'event' : 'login'};
        $scope.login(ev, $scope.data);
      }
      
    }

    $scope.login = function(ev,data) {
      $mdDialog.show({
        controller: 'LoginController'
        , templateUrl: 'app/account/login/login.html'
        , parent: angular.element(document.body)
        , targetEvent: ev

        , clickOutsideToClose: true
        , locals: {
          dataToPass: data
        }
      });

      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    $scope.contribute = function(registryid, productid, contribution){
      console.log(productid);
      console.log(contribution);
    }

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
.controller('ManageRegistryController', ['$scope', '$stateParams', '$state', 'Registry','$filter','Address',
  function($scope, $stateParams, $state,  Registry, $filter, Address) {

    $scope.clear = function() {
      $scope.registry.date = null;
    };

    $scope.save = function(form) {
      if (form.$valid) {
        Registry.update($scope.registry, function(resp) {
          Address.update($scope.address,function(resp){

          },function(err){
            console.log(err);
          })

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

    var q = {where:{registryId:$stateParams.id}};
    $scope.address = Address.get(q,function(resp){
      console.log(resp);
    });



    $scope.registry = Registry.get({ id: $stateParams.id }, function(resp) {


      console.log(resp.date)
      var date = new Date(resp.date);
      console.log(date.getFullYear())
      $scope.setDate(date.getFullYear(),date.getMonth(),date.getDate() )

      date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    });

  }
  ]);





