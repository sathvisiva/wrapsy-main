'use strict';

var express = require('express');
var controller = require('./service.controller');

var router = express.Router();


router.get('/', controller.query);
router.get('/vendors' , controller.queryVendors);
router.get('/:id/vendorsinservice', controller.getVendorsByService);
//
router.get('/:slug', controller.show);
router.get('/:id/vendor', controller.showServiceVendor);
//showServiceVendor

router.post('/', controller.create);
router.post('/vendor', controller.createServiceVendor);
router.put('/:id', controller.update);
router.put('/:id/vendor', controller.updateServiceVendor);

router.delete('/:id', controller.remove);
router.delete('/:id/vendor', controller.removeSeriveVendor);

module.exports = router;
