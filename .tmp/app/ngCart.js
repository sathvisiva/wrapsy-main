'use strict';

angular.module('ngCart', ['ngCart.directives']).config([function () {}]).provider('$ngCart', function () {
    this.$get = function () {};
}).run(['$rootScope', 'ngCart', 'ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

    $rootScope.$on('ngCart:change', function () {
        ngCart.$save();
    });

    if (angular.isObject(store.get('cart'))) {
        ngCart.$restore(store.get('cart'));
    } else {
        ngCart.init();
    }
}]).service('ngCart', ['$rootScope', 'ngCartItem', 'store', function ($rootScope, ngCartItem, store) {

    this.init = function () {
        this.$cart = {
            shipping: null,
            tax: null,
            items: [],
            vouchers: []
        };
    };

    this.addItem = function (id, name, price, quantity, data, color, size, gst, registry) {

        var inCart = this.getItemById(id);

        if (typeof inCart === 'object') {
            //Update quantity of an item if it's already in the cart
            inCart.setQuantity(quantity, false);
        } else {
            var newItem = new ngCartItem(id, name, price, quantity, data, color, size, gst, registry);
            this.$cart.items.push(newItem);
            $rootScope.$broadcast('ngCart:itemAdded', newItem);
        }

        $rootScope.$broadcast('ngCart:change', {});
    };

    this.addVoucher = function (id) {
        console.log("add Voucher" + id);
        this.$cart.vouchers.push(id);
        $rootScope.$broadcast('ngCart:change', {});
    };

    this.getVouchers = function () {
        var vouchers = this.getCart().vouchers;
        return vouchers;
    };

    this.getItemById = function (itemId) {
        var items = this.getCart().items;
        var build = false;

        angular.forEach(items, function (item) {
            if (item.getId() === itemId) {
                build = item;
            }
        });
        return build;
    };

    this.setShipping = function (shipping) {
        this.$cart.shipping = shipping;
        return this.getShipping();
    };

    this.getShipping = function () {
        if (this.getCart().items.length == 0) return 0;
        return this.getCart().shipping;
    };

    this.setTax = function (tax) {
        this.$cart.tax = +parseFloat(tax);
        return this.getTax();
    };

    this.getTax = function () {
        return this.$cart.tax;
    };

    this.setCart = function (cart) {
        this.$cart = cart;
        return this.getCart();
    };

    this.getCart = function () {
        return this.$cart;
    };

    this.getItems = function () {
        return this.getCart().items;
    };

    this.getTotalItems = function () {
        var count = 0;
        var items = this.getItems();
        angular.forEach(items, function (item) {
            count += item.getQuantity();
        });
        return count;
    };

    this.getTotalUniqueItems = function () {
        return this.getCart().items.length;
    };

    this.getSubTotal = function () {
        var total = 0;
        angular.forEach(this.getCart().items, function (item) {
            total += item.getTotal();
        });
        return +parseFloat(total).toFixed(2);
    };

    this.getTotalTax = function () {
        var totaltax = 0;
        angular.forEach(this.getCart().items, function (item) {
            totaltax += item.getGst();
        });
        return +parseFloat(totaltax).toFixed(2);
    };

    this.totalCost = function () {
        return +parseFloat(this.getSubTotal() + this.getShipping()).toFixed(2);
    };

    this.removeItem = function (index) {
        this.$cart.items.splice(index, 1);
        $rootScope.$broadcast('ngCart:itemRemoved', {});
        $rootScope.$broadcast('ngCart:change', {});
    };

    this.removeItemById = function (id) {
        var cart = this.getCart();
        angular.forEach(cart.items, function (item, index) {
            if (item.getId() === id) {
                cart.items.splice(index, 1);
            }
        });
        this.setCart(cart);
        $rootScope.$broadcast('ngCart:itemRemoved', {});
        $rootScope.$broadcast('ngCart:change', {});
    };

    this.empty = function () {

        $rootScope.$broadcast('ngCart:change', {});
        this.$cart.items = [];
        localStorage.removeItem('cart');
    };

    this.isEmpty = function () {

        return this.$cart.items.length > 0 ? false : true;
    };

    this.toObject = function () {

        if (this.getItems().length === 0) return false;

        var items = [];
        angular.forEach(this.getItems(), function (item) {
            items.push(item.toObject());
        });

        if (this.getVouchers().length === 0) {
            var vouchers = [];
        } else {
            var vouchers = [];
            angular.forEach(this.getVouchers(), function (item) {
                vouchers.push(item);
            });
        }

        return {
            shipping: this.getShipping(),
            tax: this.getTotalTax(),
            subTotal: this.getSubTotal(),
            totalCost: this.totalCost(),
            items: items,
            vouchers: vouchers

        };
    };

    this.$restore = function (storedCart) {
        var _self = this;
        _self.init();
        _self.$cart.shipping = storedCart.shipping;
        _self.$cart.tax = storedCart.tax;

        angular.forEach(storedCart.items, function (item) {
            _self.$cart.items.push(new ngCartItem(item._id, item._name, item._price, item._quantity, item._data, item._color, item._size, item._gst));
        });
        this.$save();
    };

    this.$save = function () {
        return store.set('cart', JSON.stringify(this.getCart()));
    };
}]).factory('ngCartItem', ['$rootScope', '$log', function ($rootScope, $log) {

    var item = function item(id, name, price, quantity, data, color, size, gst, registry) {
        this.setId(id);
        this.setName(name);
        this.setPrice(price);
        this.setQuantity(quantity);
        this.setData(data);
        this.setColor(color);
        this.setSize(size);
        this.setGst(gst);
        this.setRegistry(registry);
    };

    item.prototype.setId = function (id) {
        if (id) this._id = id;else {
            $log.error('An ID must be provided');
        }
    };

    item.prototype.getId = function () {
        return this._id;
    };

    item.prototype.setName = function (name) {
        if (name) this._name = name;else {
            $log.error('A name must be provided');
        }
    };
    item.prototype.getName = function () {
        return this._name;
    };

    item.prototype.setColor = function (color) {
        if (color) this._color = color;
    };
    item.prototype.getColor = function () {
        return this._color;
    };

    item.prototype.setRegistry = function (registry) {
        if (registry) this._registry = registry;
    };
    item.prototype.getRegistry = function () {
        return this._registry;
    };

    item.prototype.setSize = function (size) {
        if (size) this._size = size;
    };
    item.prototype.getSize = function () {
        return this._size;
    };

    item.prototype.setGst = function (gst) {
        var gstFloat = parseFloat(gst);
        if (gstFloat) this._gst = gstFloat;
    };
    item.prototype.getGst = function () {
        return this._gst;
    };

    item.prototype.setPrice = function (price) {
        var priceFloat = parseFloat(price);
        if (priceFloat) {
            if (priceFloat <= 0) {
                $log.error('A price must be over 0');
            } else {
                this._price = priceFloat;
            }
        } else {
            $log.error('A price must be provided');
        }
    };
    item.prototype.getPrice = function () {
        return this._price;
    };

    item.prototype.setQuantity = function (quantity, relative) {

        var quantityInt = parseInt(quantity);
        if (quantityInt % 1 === 0) {
            if (relative === true) {
                this._quantity += quantityInt;
            } else {
                this._quantity = quantityInt;
            }
            if (this._quantity < 1) this._quantity = 1;
        } else {
            this._quantity = 1;
            $log.info('Quantity must be an integer and was defaulted to 1');
        }
        $rootScope.$broadcast('ngCart:change', {});
    };

    item.prototype.getQuantity = function () {
        return this._quantity;
    };

    item.prototype.setData = function (data) {
        if (data) this._data = data;
    };

    item.prototype.getData = function () {
        if (this._data) return this._data;else $log.info('This item has no data');
    };

    item.prototype.getTotal = function () {
        return +parseFloat(this.getQuantity() * this.getPrice() + this.getGst()).toFixed(2);
    };

    item.prototype.toObject = function () {
        return {
            id: this.getId(),
            name: this.getName(),
            price: this.getPrice(),
            quantity: this.getQuantity(),
            data: this.getData(),
            total: this.getTotal(),
            color: this.getColor(),
            size: this.getSize(),
            gst: this.getGst(),
            registry: this.getRegistry()
        };
    };

    return item;
}]).service('store', ['$window', function ($window) {

    return {

        get: function get(key) {
            if ($window.localStorage[key]) {
                var cart = angular.fromJson($window.localStorage[key]);
                return JSON.parse(cart);
            }
            return false;
        },

        set: function set(key, val) {

            if (val === undefined) {
                $window.localStorage.removeItem(key);
            } else {
                $window.localStorage[key] = angular.toJson(val);
            }
            return $window.localStorage[key];
        }
    };
}]).controller('CartController', ['$scope', 'ngCart', function ($scope, ngCart) {
    $scope.ngCart = ngCart;
}]).value('version', '1.0.0');
;'use strict';

angular.module('ngCart.directives', ['ngCart.fulfilment']).controller('CartController', ['$scope', 'ngCart', function ($scope, ngCart) {
    $scope.ngCart = ngCart;
}]).directive('ngcartAddtocart', ['ngCart', function (ngCart) {
    return {
        restrict: 'E',
        controller: 'CartController',
        scope: {
            id: '@',
            name: '@',
            quantity: '@',
            quantityMax: '@',
            price: '@',
            data: '=',
            color: '@',
            size: '@',
            gst: '@',
            registry: '@'
        },
        transclude: true,
        templateUrl: function templateUrl(element, attrs) {
            if (typeof attrs.templateUrl == 'undefined') {
                return 'template/ngCart/addtocart.html';
            } else {
                return attrs.templateUrl;
            }
        },
        link: function link(scope, element, attrs) {
            scope.attrs = attrs;
            scope.inCart = function () {
                return ngCart.getItemById(attrs.id);
            };

            if (scope.inCart()) {
                scope.q = ngCart.getItemById(attrs.id).getQuantity();
            } else {
                scope.q = parseInt(scope.quantity);
            }

            scope.qtyOpt = [];
            for (var i = 1; i <= scope.quantityMax; i++) {
                scope.qtyOpt.push(i);
            }
        }

    };
}]).directive('ngcartCart', [function () {
    return {
        restrict: 'E',
        controller: 'CartController',
        scope: {},
        templateUrl: function templateUrl(element, attrs) {
            if (typeof attrs.templateUrl == 'undefined') {
                return 'template/ngCart/cart.html';
            } else {
                return attrs.templateUrl;
            }
        },
        link: function link(scope, element, attrs) {}
    };
}]).directive('ngcartSummary', [function () {
    return {
        restrict: 'E',
        controller: 'CartController',
        scope: {},
        transclude: true,
        templateUrl: function templateUrl(element, attrs) {
            if (typeof attrs.templateUrl == 'undefined') {
                return 'template/ngCart/summary.html';
            } else {
                return attrs.templateUrl;
            }
        }
    };
}]).directive('ngcartCheckout', [function () {
    return {
        restrict: 'E',
        controller: ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfilmentProvider', function ($rootScope, $scope, ngCart, fulfilmentProvider) {
            $scope.ngCart = ngCart;

            $scope.checkout = function () {
                fulfilmentProvider.setService($scope.service);
                fulfilmentProvider.setSettings($scope.settings);
                fulfilmentProvider.checkout().success(function (data, status, headers, config) {
                    $rootScope.$broadcast('ngCart:checkout_succeeded', data);
                }).error(function (data, status, headers, config) {
                    $rootScope.$broadcast('ngCart:checkout_failed', {
                        statusCode: status,
                        error: data
                    });
                });
            };
        }]),
        scope: {
            service: '@',
            settings: '='
        },
        transclude: true,
        templateUrl: function templateUrl(element, attrs) {
            if (typeof attrs.templateUrl == 'undefined') {
                return 'template/ngCart/checkout.html';
            } else {
                return attrs.templateUrl;
            }
        }
    };
}]);
;
angular.module('ngCart.fulfilment', []).service('fulfilmentProvider', ['$injector', function ($injector) {

    this._obj = {
        service: undefined,
        settings: undefined
    };

    this.setService = function (service) {
        this._obj.service = service;
    };

    this.setSettings = function (settings) {
        this._obj.settings = settings;
    };

    this.checkout = function () {
        var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
        return provider.checkout(this._obj.settings);
    };
}]).service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function ($q, $log, ngCart) {

    this.checkout = function () {

        var deferred = $q.defer();

        $log.info(ngCart.toObject());
        deferred.resolve({
            cart: ngCart.toObject()
        });

        return deferred.promise;
    };
}]).service('ngCart.fulfilment.http', ['$http', 'ngCart', function ($http, ngCart) {

    this.checkout = function (settings) {
        return $http.post(settings.url, { data: ngCart.toObject(), options: settings.options });
    };
}]).service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function ($http, ngCart) {}]);
//# sourceMappingURL=ngCart.js.map
