/**
 * Main application routes
 */

 'use strict';

 import errors from './components/errors';
 import path from 'path';
 var sha512 = require('js-sha512');

 export default function(app) {
  // Insert routes below
  app.use('/api/vendor', require('./api/vendor'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/catalogs', require('./api/catalog'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/registry', require('./api/registry'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/address', require('./api/address'));
  app.use('/api/voucher', require('./api/voucher'));
  app.use('/api/home', require('./api/home'));
  app.use('/api/payment', require('./api/payment'));
  app.use('/auth', require('./auth'));

  

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
  .get((req, res) => {
    res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
  });
}
