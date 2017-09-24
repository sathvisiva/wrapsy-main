/**
 * Main application routes
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _componentsErrors = require('./components/errors');

var _componentsErrors2 = _interopRequireDefault(_componentsErrors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var sha512 = require('js-sha512');

exports['default'] = function (app) {
  // Insert routes below
  app.use('/api/requests', require('./api/request'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/orders', require('./api/order'));
  // app.use('/api/variants', require('./api/variant'));
  // app.use('/api/reviews', require('./api/review'));
  // app.use('/api/images', require('./api/image'));
  app.use('/api/catalogs', require('./api/catalog'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/registry', require('./api/registry'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/address', require('./api/address'));
  app.use('/api/voucher', require('./api/voucher'));
  app.use('/api/payment', require('./api/payment'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(_componentsErrors2['default'][404]);

  // All other routes should redirect to the index.html
  app.route('/*').get(function (req, res) {
    res.sendFile(_path2['default'].resolve(app.get('appPath') + '/index.html'));
  });
};

module.exports = exports['default'];
//# sourceMappingURL=routes.js.map
