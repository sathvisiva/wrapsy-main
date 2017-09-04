'use strict';

var express = require('express');
var controller = require('./product.controller');
var multiparty = require('connect-multiparty');
var uploadOptions = { autoFile: true,
                      uploadDir: 'client/assets/uploads/'
}

var router = express.Router();

// product
router.post('/:id/upload', multiparty(uploadOptions), controller.upload);
router.get('/', controller.index);
router.get('/affiliate', controller.indexAffiliateProduct);
router.get('/:slug', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/:slug/catalog/', controller.catalogindex);
router.get('/:slug/search/:term', controller.search);
router.post('/productCount', controller.count);
router.post('/:id/addfeaturedPdt', controller.addtofeaturedproducts);
router.post('/:id/removefeaturedPdt', controller.removefromfeaturedproducts);
//addtofeaturedproducts


//image
router.post('/:id/images', multiparty(uploadOptions), controller.uploadImage);
router.get('/:id/images', controller.indexImage);
router.put('/:id/images/:image_id', controller.updateImage);

// Reviews
router.post('/:id/reviews', controller.createReview);
router.get('/:id/reviews', controller.indexReview);
router.put('/:id/reviews/:review_id', controller.updateReview);
router.patch('/:id/reviews/:review_id', controller.updateReview);

// Features
router.post('/features', controller.createFeature );
router.post('/indexFeatures', controller.indexFeatures);
router.put('/:id/features', controller.updateFeature);
router.post('/:id/destroyFeature', controller.destroyFeature);

router.post('/filters', controller.createFilter );
router.post('/indexFilters', controller.indexFilters);
router.post('/:id/destroyFilter', controller.destroyFilter);

module.exports = router;
