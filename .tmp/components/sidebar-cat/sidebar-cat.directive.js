'use strict';

angular.module('bhcmartApp').directive('sidebarCat', function () {
  return {
    templateUrl: 'components/sidebar-cat/sidebar-cat.html',
    restrict: 'EA',
    controller: 'SidebarCatCtrl',
    link: function link(scope, element, attrs) {}
  };
});
//# sourceMappingURL=sidebar-cat.directive.js.map
