'use strict';

var express = require('express');
var controller = require('./catalog.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:slug', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router['delete']('/:id', controller.destroy);
router.post('/catalogCount', controller.count);

module.exports = router;
//# sourceMappingURL=index.js.map