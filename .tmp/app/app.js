'use strict';

angular.module('bhcmartApp', ['bhcmartApp.auth', 'bhcmartApp.admin', 'bhcmartApp.constants', 'ngCart', 'ngCookies', 'ngResource', 'ngSanitize', 'ui.router', 'validation.match', 'ui.bootstrap', 'ngFileUpload', 'toaster', 'socialLinks', 'slickCarousel', 'ngMaterial', 'ngMessages', 'rzModule', 'uiCropper']).config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, $uiViewScrollProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $uiViewScrollProvider.useAnchorScroll();

  $mdThemingProvider.theme('default').primaryPalette('cyan').accentPalette('pink');
}).run(function ($rootScope, $state, ngCart, $location) {
  $.scrollUp({
    scrollName: 'scrollUp',
    scrollText: '<i class="fa fa-angle-up"></i>',
    easingType: 'linear',
    scrollSpeed: 900,
    animation: 'fade',
    animationInSpeed: 2000
  });
  ngCart.setShipping(50);
  $rootScope.ngCart = ngCart;
  $rootScope.$state = $state;
  $rootScope._ = _;
  $rootScope.location = $location;
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    if ($stateParams.scrollTo) {
      $location.hash($stateParams.scrollTo);
      $anchorScroll();
    }
  });
}).directive("randomBackgroundcolor", function () {
  return {
    restrict: 'EA',
    replace: false,
    link: function link(scope, element, attr) {

      //generate random color
      var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

      //Add random background class to selected element
      element.css('background-color', color);
    }
  };
}).directive('countdowner', function () {
  return {
    link: function link(scope, element, attrs) {
      //Countdown
      $(element).each(function () {
        var $this = $(this),
            finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function (event) {
          $this.html(event.strftime('<h4 class="cdown days"><span class="counting">%-D</span></h4><h4 class="cdown hours"><span class="counting">%-H</span></h4><h4 class="cdown minutes"><span class="counting">%M</span></h4><h4 class="cdown seconds"><span><span class="counting">%S</span></h4>'));
        });
      });
    }
  };
}).directive('printPage', function ($timeout) {
  return {
    link: function link(scope, element, attrs) {
      //Product Details Page Plus Minus Button
      $timeout(function () {
        $(element).click(function () {
          $(this).hide();
          window.print();
        });
      }, 0);
    }
  };
}).directive('phone', function () {
  return {
    restrice: 'A',
    require: 'ngModel',
    link: function link(scope, element, attrs, ctrl) {
      angular.element(element).bind('blur', function () {
        var value = this.value;
        var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
        if (PHONE_REGEXP.test(value)) {
          // Valid input
          console.log("valid phone number");
          angular.element(this).next().next().css('display', 'none');
        } else {
          // Invalid input 
          console.log("invalid phone number");
          angular.element(this).next().next().css('display', 'block');
          /* 
              Looks like at this point ctrl is not available,
              so I can't user the following method to display the error node:
              ctrl.$setValidity('currencyField', false); 
              */
        }
      });
    }
  };
});
//# sourceMappingURL=app.js.map
