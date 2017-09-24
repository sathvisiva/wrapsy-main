'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _userController = require('./user.controller');

var controller = _interopRequireWildcard(_userController);

var _authAuthService = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_authAuthService);

var router = new _express.Router();

router.get('/', controller.index);
router['delete']('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/:id/permission', auth.hasRole('admin'), controller.authorize);
router.put('/:id/permission/:cat_id', auth.hasRole('admin'), controller.deAuthorize);
router.post('/forgot', controller.forgot);
router.post('/userCount', controller.count);
router.get('/resetpassword', controller.getresetuser);

exports['default'] = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
