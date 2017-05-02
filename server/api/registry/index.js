'use strict';

var express = require('express');
var controller = require('./registry.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/count', controller.count);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/:id/registryProduct', controller.createregistryProduct);
router.post('/:id/rsvpRegistry', controller.creatersvpRegistry);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id',  controller.destroy);
router.get('/search/:term', controller.search);




module.exports = router;
