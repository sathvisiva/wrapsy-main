'use strict';

var express = require('express');
var controller = require('./registry.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/count', controller.count);
router.get('/:id', controller.show);
router.post('/', controller.create);
//
router.post('/makevisible', controller.makevisible);
router.post('/:id/registryProduct', controller.createregistryProduct);
router.post('/:id/getregistryProduct', controller.getRegistryProduct);
router.post('/:id/rsvpRegistry', controller.creatersvpRegistry);
router.get('/:id/registryGuest', controller.indexrsvpRegistry);
router.post('/:id/guestBookRegistry', controller.createGuestBookRegistry);
router.get('/:id/registryGuestBook', controller.indexGuestBookRegistry);
router.post('/:id/accomodation', controller.createAccomodation );
router.get('/:id/accomodation', controller.indexAccomodation );
router.post('/:id/contribution', controller.createContribution  );
router.get('/:id/contribution', controller.indexContribution  );
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id',  controller.destroy);
router.get('/search/:term', controller.search);
router.post('/:id/updatePdtcnt', controller.updatePdtcnt);

module.exports = router;
