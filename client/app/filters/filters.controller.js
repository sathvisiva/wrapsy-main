'use strict';

angular.module('bhcmartApp')
.controller('FiltersCtrl', ['$scope', 'Filter', 'Modal' ,'$filter','Feature','$mdDialog',
  function($scope, Filter, Modal,$filter,Feature,$mdDialog) {

    $scope.SelectedRow = function(key){
      $scope.options = $filter('filter')($scope.filterfeatures, {key: key })[0].v;
      console.log($scope.options)

    }

    $scope.query = function(){
      Filter.query(function(data) {
        $scope.filters = data;
        $scope.currentPage = 1;
        $scope.totalItems = $scope.data.length;
        $scope.itemsPerPage = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      });
    }

    $scope.query()

    $scope.save = function(form) {
      if (form.$valid) {
        console.log($scope.filter)

        Filter.save($scope.filter, function(resp) {
          $scope.filter = {};
          $scope.query()
        }, function(err) {
          console.log(err);
          $scope.message == err;
        });
      }
    }



    var datas = []
    Feature.group(function(data) {     
      $scope.filterfeatures = data
      datas = data
      console.log($scope.filterfeatures)

    });
    $scope.deletefilter = function(ev, filter) {
      var confirm = $mdDialog.confirm()
      .title('Would you like to delete Filter ' + filter.name +'?')
      .ariaLabel('Delete filter')
      .targetEvent(ev)
      .ok('Please do it!')
      .cancel('Cancel');

      $mdDialog.show(confirm).then(function() {
        $scope.status = 'ok';
        filter.$remove(filter._id, function(resp) {
          $scope.query()
        })
      }, function() {
        $scope.status = 'cancel';
        console.log($scope.status)
      });
    };
  }
  ]);


