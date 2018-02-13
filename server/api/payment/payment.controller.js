/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Vouchers              ->  index
 * POST    /api/Vouchers              ->  create
 * GET     /api/Vouchers/:id          ->  show
 * PUT     /api/Vouchers/:id          ->  update
 * DELETE  /api/Vouchers/:id          ->  destroy
 */

 'use strict';

 import _ from 'lodash';
 var Payment = require('./payment.model');
 var sha512 = require('js-sha512');
 var cc = require('coupon-code');
 var Voucher = require('../voucher/voucher.model');
 var mail = require('../mail/sendmail');
 var Order = require('../order/order.model');
 var Registry = require('../registry/registry.model').registry;
 var Contribution = require('../registry/registry.model').contribution
 var Registrycontroller = require('../registry/registry.controller');
 var Cart = require('../cart/cart.model')

 function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}


function updateVoucher(res,productinfo){

  console.log(res);
  console.log(productinfo);



}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
    .spread(updated => {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
      .then(() => {
        res.status(204).end();
      });
    }
  };
}

export function createHash(req, res) {
  console.log("inside create hash");
  var salt = 'eCwWELxi';
  var hash = sha512(req.body.preHashString + salt);
  console.log(hash);
  res.send({success : true, hash: hash});
}

export function giftSuccessPaymentStatus(req, res) {


  Payment.create(req.body, function(err, payment){
    if(err){
      handleError(payment)
    }

    Voucher.findByIdAsync(payment.productinfo )
    .then(function(voucher) {
      voucher.paid = true;
      voucher.txn = payment._id;
      voucher.saveAsync();
      var date = new Date(voucher.validuntil);
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var dt = date.getDate();

      if (dt < 10) {
        dt = '0' + dt;
      }
      if (month < 10) {
        month = '0' + month;
      }

      var fulldate = year+'-' + month + '-'+dt


      if(err) { return handleError(err); }
      let voucherdetails = [
      {
        'email': voucher.email,
        'amount': voucher.amount,
        'vouchercode': voucher.code,
        'validuntil' : fulldate
      }
      ];

      console.log(voucherdetails);
      mail.sendmail('voucher',voucherdetails);
    })
    .then(function(voucher){
    });    
    res.redirect('/successstatus/myvouchers');
    //res.redirect('/myvouchers');
  });
}







/*  Payment.create(req.body, function(err, payment){
    if(err){
      handleError(payment)
    }

    Voucher.update({ _id: req.body.productinfo }, { $set: { paid: true,  paymentId: payment._id }}, function (err, voucher) {
      if (err) {
        handleError(err)
      }

      Voucher.findById(req.body.productinfo, function (err, voucher) {

        var date = new Date(voucher.validuntil);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var dt = date.getDate();

        if (dt < 10) {
          dt = '0' + dt;
        }
        if (month < 10) {
          month = '0' + month;
        }

        var fulldate = year+'-' + month + '-'+dt


        if(err) { return handleError(err); }
        let voucherdetails = [
        {
          'email': 'sathvi.prasi@gmail.com',//voucher.email,
          'amount': voucher.amount,
          'vouchercode': voucher.code,
          'validuntil' : fulldate
        }
        ];

        console.log(voucherdetails);
        mail.sendmail('voucher',voucherdetails);

      });



      res.redirect('/myvouchers');
    });
  });*/


  
  


  


  export function giftFilurePaymentStatus(req, res){


    console.log(req);
    console.log(req.body);

    Payment.create(req.body, function(err, payment){
      if(err){
        handleError(payment)
      }

      Voucher.findByIdAsync(payment.productinfo )
      .then(function(voucher) {
        voucher.paid = false;
        voucher.txn = payment._id;
        voucher.saveAsync();
      });    
      res.redirect('/failurestatus/giftcard');
    });

  }



/*  Voucher.update({ _id: req.body.productinfo }, { $set: { paid: false ,  }}, function (err, voucher) {
    if (err) {
      responseObject.err = err;
      responseObject.data = null;
      responseObject.code = 422;

      return res.json(responseObject);
    }

    res.redirect('/myvouchers');
  });*/



/*export function pdtPaymentStatus(req, res) {

  Payment.create(req.body, function(err, payment){
    if(err){
      handleError(payment)
    }

    Order.findByIdAsync(payment.productinfo )
    .then(function(order) {
      order.paid = true;
      order.txn = payment._id;
      order.saveAsync();
    });    
    res.redirect('/orders');
  }
}
*/

export function pdtPaymentStatus(req,res){
  Payment.createAsync(req.body)
  .then(payment => {
    if (payment) {
      Order.findByIdAsync(payment.productinfo )
      .then(function(order) {
        order.paid = true
        order.txn = payment._id
        order.saveAsync();
        Cart.removeAsync({'_id' : order.customerId })
      });
      res.redirect('/successstatus/orders');
    }
  })
  .catch(handleError(res));
}

export function pdtPaymentFailureStatus(req,res){
 Payment.createAsync(req.body)
 .then(payment => {
  if (payment) {
    Order.findByIdAsync(payment.productinfo )
    .then(function(order) {
      order.paid = false
      order.txn = payment._id
      order.saveAsync();
      if (order) {
        if(order.vouchers){
          console.log('Vouchers' + order.vouchers)
          Voucher.findByIdAsync(order.vouchers)
          .then(function(voucher){
            voucher.redeemed = false;
            voucher.saveAsync();
          })
        }
        _.each(order.items, function(i) {
          Product.findByIdAsync(i.products)
          .then(function(product) {
            product.stock += i.quantity;
            product.saveAsync();
          });

          if(i.registry){
            Registrycontroller.revertRegistryProduct(i.registry,i.products,i.quantity)
          }
        })
      }
    });
    res.redirect('/failurestatus/checkout');
  }
})
 .catch(handleError(res));

}




export function contributionStatus(req, res) {
  console.log('payment success');
  console.log(req.body);
  var slug = '';
  console.log(JSON.stringify(req.body.productinfo));
  var str = JSON.stringify(req.body.productinfo);
  var productInfo = str.split(" ");
  var contribution = {}
  contribution.productId = productInfo[0].slice(1);
  contribution.contribution = productInfo[1];
  contribution.registryId = productInfo[2];
  contribution.name = productInfo[3];
  console.log(productInfo.length)
  slug = productInfo[productInfo.length - 1];
  slug = slug.substring(0, slug.length - 1);
  Contribution.create(contribution, function(err, registry) {
    if(err) { return handleError(res, err); }
    
  });

  console.log(contribution.contribution);
  console.log(contribution.registryId);
  console.log(contribution.productId);

  var increment = {
    $inc: {
      'products.$.paid': parseInt(contribution.contribution)
    }
  };
  var query = {
    '_id': contribution.registryId.toString(),
    'products._id': contribution.productId.toString()

  };

  Registry.update(query, increment, function(err,registry){
    console.log(registry);
  });

  res.redirect('/successstatusc/registry/'+slug);
  /*res.redirect('/myvouchers');*/


}

export function contributionFailureStatus(req, res) {
  res.redirect('/myvouchers');

}

  // Gets a list of Vouchers
  export function index(req, res) {
    Voucher.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
  }

  // Gets a single Voucher from the DB
  export function show(req, res) {
    Voucher.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
  }

  // Creates a new Voucher in the DB
  export function create(req, res) {


    req.body.code = cc.generate();;
    console.log(req.body);

    Voucher.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
  }

  // Updates an existing Voucher in the DB
  export function update(req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    Voucher.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
  }

  // Deletes a Voucher from the DB
  export function destroy(req, res) {
    Voucher.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
  }
