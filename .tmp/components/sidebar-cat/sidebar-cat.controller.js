'use strict';

angular.module('bhcmartApp').controller('SidebarCatCtrl', function ($scope, Catalog) {
  var self = $scope;

  Catalog.query(function (categories) {
    self.categories = categories;
    self.allCategory = _.filter(categories, function (category) {
      return category.ancestors.length == 0;
    });
    var parentCategories = _.filter(categories, function (category) {
      return category.ancestors.length == 1 && category.slug != "upsell-products";
    });
    self.parentCategories = _.map(parentCategories, function (parentCategory) {
      parentCategory.children = _.map(parentCategory.children, function (childId) {
        if (childId) return _.find(categories, {
          "_id": childId
        });
      });
      return parentCategory;
    });
  });
});
//# sourceMappingURL=sidebar-cat.controller.js.map
