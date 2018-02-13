'use strict';

var express = require('express');
var controller = require('./blog.controller');

var router = express.Router();

/*router.param('id', controller.course);*/

//router.get('/', controller.index);
router.get('/', controller.query);
router.get('/:slug', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.get('/:id/comments', controller.getComments);
router.post('/:id/comment', controller.createComment);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);
router.delete('/:id', controller.remove);

module.exports = router;
