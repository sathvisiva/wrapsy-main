/**
 * Main application routes
 */

 'use strict';

 import errors from './components/errors';
 import path from 'path';

 export default function(app) {
  // Insert routes below
  app.use('/api/requests', require('./api/request'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/features', require('./api/feature'));
  app.use('/api/filters', require('./api/filter'));
  app.use('/api/cart', require('./api/cart'));
  app.use('/api/catalogs', require('./api/catalog'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/services', require('./api/service'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/vendors', require('./api/vendor'));
  app.use('/api/payment', require('./api/payment'));
  app.use('/api/voucher', require('./api/voucher'));
  app.use('/api/registry', require('./api/registry'));
  app.use('/api/home', require('./api/home'));
  app.use('/api/address', require('./api/address'));
  app.use('/api/blog', require('./api/blog'));


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
