'use strict';

var express = require('express');
var controller = require('./order.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/myorders', controller.myOrders);
router.post('/', controller.create);
router.get('/:id', controller.updateCancel);
router.post('/:id/updateCancel', controller.updateCancel);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
