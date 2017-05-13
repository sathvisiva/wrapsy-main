'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var MainController = function MainController($http, $scope, $timeout, socket, Catalog, Product, ngCart, $state, $stateParams, $rootScope, RegistryService, $window) {
    _classCallCheck(this, MainController);

    $scope.state = $state.current;
    $scope.params = $stateParams;
    $scope.registryId = $scope.params.registryId;
    $scope.registrytitle = $scope.params.registryTitle;

    $scope.registrydata = RegistryService.getregistry();

    console.log(RegistryService.getregistry());

    $scope.addtoRegistry = function (productId) {
      var result = { id: productId, registryId: $scope.registryId, registryTitle: $scope.registrytitle };
      $state.go('product', result);
    };

    $scope.buynow = function (link) {
      $window.open(link, '_blank');
    };

    this.featuredBannerA = [{
      'img': 'assets/img/banner/banner-21.jpg',
      'link': '#'
    }, {
      'img': 'assets/img/banner/banner-22.jpg',
      'link': '#'
    }];

    this.featuredBannerB = {
      'img': 'assets/img/banner/banner-24.jpg',
      'link': '/category/fashion'
    };

    this.sliderAreaBanner = {
      'img': 'assets/img/banner/banner-28.jpg',
      'link': '/category/home'
    };

    this.limitedTimeFeatured = false;

    var featuredCategoriesA = [{
      'slug': 'computers-and-accessories',
      'banner': {
        'img': 'assets/img/banner/banner-31.jpg',
        'link': '/category/computers-and-accessories'
      }
    }, {
      'slug': 'fashion',
      'banner': {
        'img': 'assets/img/banner/banner-32.jpg',
        'link': '/category/fashion'
      }
    }];

    var featuredCategoriesB = [{
      'slug': 'home-and-kitchen',
      'banner': {
        'img': 'assets/img/banner/banner-33.jpg',
        'link': '/category/home-and-kitchen'
      }
    }, {
      'slug': 'art-works',
      'banner': {
        'img': 'assets/img/banner/banner-34.jpg',
        'link': '/category/art-works'
      }
    }
    /*, {
            'slug': 'laptops',
            'banner': {
              'img': 'assets/img/banner/banner-35.jpg',
              'link': '/category/laptops'
            }
          }*/
    ];

    this.$http = $http;
    this.awesomeThings = [];
    self = this;

    /* $http.get('/api/things').then(response => {
       this.awesomeThings = response.data;
       socket.syncUpdates('thing', this.awesomeThings);
     });*/

    var featuredCategoriesDetailsA = [];
    _.each(featuredCategoriesA, function (o) {
      Catalog.get({ id: o.slug }, function (parentCat) {
        var a = {
          title: parentCat.name,
          slug: parentCat.slug,
          banner: o.banner,
          firstChildren: []
        };
        if (parentCat.children.length > 0) {
          _.each(parentCat.children, function (c) {
            Product.catalog({ id: c.slug, limit: 10 }, function (prod) {
              prod = _.map(prod, function (rP) {
                return _.extend(rP, { averageRating: getAverageRating(rP) });
              });
              var p = {
                title: c.name,
                slug: c.slug,
                products: prod
              };
              a.firstChildren.push(p);
            });
          });
        } else {
          Product.catalog({ id: o.slug, limit: 10 }, function (prod) {
            prod = _.map(prod, function (rP) {
              return _.extend(rP, { averageRating: getAverageRating(rP) });
            });
            var p = {
              title: o.name,
              slug: o.slug,
              products: prod
            };
            a.firstChildren.push(p);
          });
        }
        featuredCategoriesDetailsA.push(a);
        self.featuredCategoriesDetailsA = featuredCategoriesDetailsA;
      });
    });

    var featuredCategoriesDetailsB = [];
    _.each(featuredCategoriesB, function (o) {
      Catalog.get({ id: o.slug }, function (parentCat) {
        var a = {
          title: parentCat.name,
          slug: parentCat.slug,
          banner: o.banner,
          firstChildren: []
        };
        if (parentCat.children.length > 0) {
          _.each(parentCat.children, function (c) {
            Product.catalog({ id: c.slug, limit: 10 }, function (prod) {
              prod = _.map(prod, function (rP) {
                return _.extend(rP, { averageRating: getAverageRating(rP) });
              });
              var p = {
                title: c.name,
                slug: c.slug,
                products: prod
              };
              a.firstChildren.push(p);
            });
          });
        } else {
          Product.catalog({ id: o.slug, limit: 10 }, function (prod) {
            prod = _.map(prod, function (rP) {
              return _.extend(rP, { averageRating: getAverageRating(rP) });
            });
            var p = {
              title: o.name,
              slug: o.slug,
              products: prod
            };
            a.firstChildren.push(p);
          });
        }
        featuredCategoriesDetailsB.push(a);
        self.featuredCategoriesDetailsB = featuredCategoriesDetailsB;
      });
    });

    _.each(featuredCategoriesA, function (slug) {
      self.featuredCategoriesDetailsA = Catalog.get({ id: slug });
    });
  };

  angular.module('bhcmartApp').controller('MainController', MainController);
})();

var getAverageRating = function getAverageRating(p) {
  return Math.ceil(_.reduce(p.reviews, function (a, b) {
    return a + b.rating;
  }, 0) / p.reviews.length);
};
//# sourceMappingURL=main.controller.js.map
