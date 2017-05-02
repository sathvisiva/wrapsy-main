'use strict';

angular.module('bhcmartApp').directive('sidebarAccount', function () {
  return {
    templateUrl: 'components/sidebar-account/sidebar-account.html',
    controller: 'SidebarAccountCtrl',
    restrict: 'EA',
    link: function link(scope, element, attrs) {}
  };
});
//# sourceMappingURL=sidebar-account.directive.js.map
