'use strict';

var express = require('express');
var controller = require('./payment.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/createHash', controller.createHash);
router.post('/pdtPaymentStatus', controller.pdtPaymentStatus);
router.post('/giftSuccessPaymentStatus', controller.giftSuccessPaymentStatus);
router.post('/giftFilurePaymentStatus', controller.giftFilurePaymentStatus);
router.post('/contributionStatus',controller.contributionStatus)
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
