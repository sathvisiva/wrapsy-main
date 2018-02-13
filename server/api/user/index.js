'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/',  controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/:id/permission', auth.hasRole('admin'), controller.authorize);
router.put('/:id/permission/:cat_id', auth.hasRole('admin'), controller.deAuthorize);
router.post('/forgot', controller.forgot);
router.post('/userCount', controller.count);
router.get('/resetpassword', controller.getresetuser);
router.post('/:id/addTocart', controller.addToCart);

export default router;
