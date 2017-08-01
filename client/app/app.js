'use strict';

angular.module('bhcmartApp', [
  'bhcmartApp.auth',
  'bhcmartApp.admin',
  'bhcmartApp.constants',
  'ngCart',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'validation.match',
  'ui.bootstrap',
  'ngFileUpload',
  'toaster',
  'socialLinks',
  'slickCarousel',
  'ngMaterial',
  'ngMessages',
  'rzModule'
  ])
.config(function($urlRouterProvider, $locationProvider, $mdThemingProvider) {
  $urlRouterProvider
  .otherwise('/');
  $locationProvider.html5Mode(true);
  $mdThemingProvider.theme('default')
  .primaryPalette('cyan')
  .accentPalette('pink');

})

.run(function($rootScope, $state, ngCart,$location) {
  $.scrollUp({
    scrollName: 'scrollUp',
    scrollText: '<i class="fa fa-angle-up"></i>',
    easingType: 'linear',
    scrollSpeed: 900,
    animation: 'fade',
    animationInSpeed: 2000
  });
  ngCart.setShipping(0);
  $rootScope.ngCart = ngCart;
  $rootScope.$state = $state;
  $rootScope._ = _;
  $rootScope.location = $location;
})
.directive('myTab', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        $(element).click(function(e) {
          e.preventDefault()
          $(this).tab('show')
        })
      })
    }
  }
})
.directive("randomBackgroundcolor", function () {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {

            //generate random color
            var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16); 
            
            //Add random background class to selected element
            element.css('background-color', color);

        }
    }
})
.directive('slideit', function() {
  return {
    link: function(scope, element, attrs) {
      $(element).nivoSlider({
        effect: 'fade',
        slices: 15,
        boxCols: 12,
        boxRows: 12,
        animSpeed: 500,
        pauseTime: 5000,
        startSlide: 0,
        directionNav: false,
        controlNavThumbs: false,
        pauseOnHover: true,
        manualAdvance: true
      });
    }
  }
})

.directive('countdowner', function() {
  return {
    link: function(scope, element, attrs) {
        //Countdown
        $(element).each(function() {
          var $this = $(this),
          finalDate = $(this).data('countdown');
          $this.countdown(finalDate, function(event) {
            $this.html(event.strftime('<h4 class="cdown days"><span class="counting">%-D</span></h4><h4 class="cdown hours"><span class="counting">%-H</span></h4><h4 class="cdown minutes"><span class="counting">%M</span></h4><h4 class="cdown seconds"><span><span class="counting">%S</span></h4>'));
          });
        });
      }
    }
  })
.directive('meanmenu', function($timeout) {
  return {
    link: function(scope, element, attrs) {
        //MeanMenu Js
        $timeout(function() {
          $(element).meanmenu();
        }, 0);
      }
    }
  }).directive('sliderRange', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        //Shop Grid/List Page Price-slider js
        $timeout(function() {
          $(element).slider({
            range: true,
            min: 0,
            max: 500000,
            values: [0, 300000],
            slide: function(event, ui) {
              $("#amount").val("₹" + ui.values[0] + " - ₹" + ui.values[1]);
            }
          });
        }, 0);
      }
    }
  }).directive('amount', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        //Shop Grid/List Page Price-slider js
        $timeout(function() {
          $(element).val("₹" + $("#slider-range").slider("values", 0) +
            " - ₹" + $("#slider-range").slider("values", 1));
        }, 0);
      }
    }
  }).directive('bxslider', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        //Shop Grid/List Page Price-slider js
        $timeout(function() {
          $(element).bxSlider({
            minSlides: 4,
            maxSlides: 4,
            slideWidth: 270,
            nextSelector: '#slider-next',
            prevSelector: '#slider-prev',
            prevText: '<i class="fa fa-angle-left"></i>',
            nextText: '<i class="fa fa-angle-right"></i>'
          });
        }, 0);
      }
    }
  }).directive('zoom', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        //Elevate Zoom
        $timeout(function() {
          $(element).elevateZoom({
            easing: true,
            cursor: "crosshair",
            zoomWindowFadeIn: 300,
            zoomWindowFadeOut: 350
          });
        }, 0);
      }
    }
  }).directive('printPage', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        //Product Details Page Plus Minus Button
        $timeout(function() {
          $(element).click(function() {
            $(this).hide();
            window.print();
          });
        }, 0);
      }
    }
  }).directive('qtybutton', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        //Product Details Page Plus Minus Button 2
        $timeout(function() {
          $(element).on("click", function() {
            var $button = $(this);
            var oldValue = $button.parent().find("input").val();
            var attrs = $button.parent().find("input")[0];
            if ($button.text() == "+" && parseFloat(oldValue) < attrs.max) {
              var newVal = parseFloat(oldValue) + 1;
            } else {
              // Don't allow decrementing below min
              if (oldValue > attrs.min) {
                var newVal = parseFloat(oldValue) - 1;
              } else {
                newVal = attrs.min;
              }
            }
            $button.parent().find("input").val(newVal);
            angular.element($button.parent().find("input")).triggerHandler('input');
          });

        }, 0);
      }
    }
  })


  .directive('phone', function() {
    return {
      restrice: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        angular.element(element).bind('blur', function() {
          var value = this.value;
          var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
          if(PHONE_REGEXP.test(value)) {
                    // Valid input
                    console.log("valid phone number");
                    angular.element(this).next().next().css('display','none');  
                  } else {
                    // Invalid input  
                    console.log("invalid phone number");
                    angular.element(this).next().next().css('display','block');
                    /* 
                        Looks like at this point ctrl is not available,
                        so I can't user the following method to display the error node:
                        ctrl.$setValidity('currencyField', false); 
                        */                    
                      }
                    });              
      }            
    }        
  });

