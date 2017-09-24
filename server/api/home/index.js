'use strict';

var express = require('express');
var controller = require('./home.controller');


var router = express.Router();

//
router.post('/hompageImg', controller.createHomePageImg);
router.post('/popularCat', controller.createPopularCategory);
router.delete('/:id/hompageImg',  controller.destroyHomePageImg);
router.delete('/:id/popularCat',  controller.destroyPopularCategory);
router.get('/hompageImg', controller.indexHomePageImg);
router.get('/popularCat', controller.indexpopularCategory);



module.exports = router;
