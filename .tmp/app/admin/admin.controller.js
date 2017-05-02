'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var AdminController = function AdminController(User, Modal) {
    var _this = this;

    _classCallCheck(this, AdminController);

    // Use the User $resource to fetch all users
    var self = this;
    User.query(function (users) {
      self.users = users;
      // pagination controls
      self.currentPage = 1;
      self.totalItems = self.users.length;
      self.itemsPerPage = 10; // items per page
      self.noOfPages = Math.ceil(self.totalItems / self.itemsPerPage);
    });

    this['delete'] = Modal.confirm['delete'](function (user) {
      user.$remove();
      _this.users.splice(_this.users.indexOf(user), 1);
    });
  };

  angular.module('bhcmartApp.admin').controller('AdminController', AdminController);
})();
//# sourceMappingURL=admin.controller.js.map
