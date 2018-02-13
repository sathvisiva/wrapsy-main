'use strict';

angular.module('bhcmartApp').controller('ManageRequestsCtrl', ['$scope', 'Modal', 'Request', 'Auth', function ($scope, Modal, Request, Auth) {
  var user = Auth.getCurrentUser();
  $scope.isAdmin = Auth.hasRole('admin');
  $scope.requests = [];

  Request.query(function (requests) {
    $scope.requests = requests;
    // pagination controls
    $scope.currentPage = 1;
    $scope.totalItems = $scope.requests.length;
    $scope.itemsPerPage = 10; // items per page
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  });

  $scope.deleteRequest = Modal.confirm['delete'](function (o) {
    o.$remove(o._id, function (resp) {
      console.log(resp);
      $scope.requests.splice($scope.requests.indexOf(o), 1);
    });
  });

  $scope.deliverRequest = Modal.confirm.process(function (o) {
    o.processed = o.processed ? false : true;
    o.$update(function (resp) {
      console.log(resp);
    });
  });
}]);
//# sourceMappingURL=manage-requests.controller.js.map
