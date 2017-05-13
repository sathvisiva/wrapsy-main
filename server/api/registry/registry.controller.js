'use strict';

var _ = require('lodash');
var nodemailer = require("nodemailer");
var Registry = require('./registry.model').registry;
var Rsvp = require('./registry.model').rsvp;
var GuestBook = require('./registry.model').guestBook;
var smtpTransport = require('nodemailer-smtp-transport');

/*var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "sathvisiva@gmail.com",
        pass: "couchpotato"
    }
});*/


var transport = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  host : 'smtp.gmail.com',
  secureConnection: true,
  port : 465,
  auth:{
    user : "sathvisiva@gmail.com",     //username
    pass : "couchpotato"                //password
  }
}));

function isJson(str) {
	try {
		str = JSON.parse(str);
	} catch (e) {
		str = str;
	}
	return str
}


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.error(err, statusCode);
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
	
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
    	console.log("inside entity")
    	
		res.end(JSON.stringify(entity));
      
    }
  };
}

// Get all features group
exports.count = function(req, res) {
	
	if(req.query){
		var q = isJson(req.query.where);
		Wishlist.find(q).count().exec(function (err, count) {
			if(err) { 
				console.log(err)
				return handleError(res, err); }
				return res.status(200).json([{count:count}]);
			});
	}
};

// Get list of products
exports.index = function(req, res) {
	if(req.query){

		if(req.query.count){
			
			var q = isJson(req.query.count);
						
			Registry.find(q).select('_id occasion').exec(function (err, registries) {
				if(err) { 
					console.log(err)
					return handleError(res, err); }
					
					return res.status(200).json(registries);
				});
		}
		else{
			
			var q = isJson(req.query.where);
			console.log(q);
			Registry.find(q).exec(function (err, registry) {
				if(err) { console.log(err);
					return handleError(res, err); }
					console.log(registry)
					return res.status(200).json(registry);
				});
		}



	}else{
		Registry.find(function (err, registry) {
			if(err) { return handleError(res, err); }
			return res.status(200).json(registry);
		});
	}
};



// Get a single product
exports.show = function(req, res) {
  
  Registry.findById(req.params.id, function (err, registry) {
    
    if(err) { return handleError(res, err); }
    if(!registry) { return res.status(404).send('Not Found'); }
    return res.json(registry);
  });
};


exports.sendmail = function(req,res){
  var mailOptions = {
    from: "sathvisiva.gmail.com", // sender address
    to: "sathvi.prasi@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
  }

  transport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});

}

// Creates a new product in the DB.
/*exports.create = function(req, res) {
	console.log(req.body)
  Registry.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};*/

exports.create = function(req, res) {
	
	Registry.create(req.body, function(err, registry) {
		if(err) { return handleError(res, err); }
		
		return res.status(201).json(registry);
	});
};

exports.createregistryProduct = function(req, res) {
	
	/*RegistryProduct.create(req.body, function(err, registry) {
		if(err) { return handleError(res, err); }
		
		return res.status(201).json(registry);
	});*/
/*
	RegistryProduct.createAsync(req.body)
    .then(linkRegistryProduct(res, req.params.id))
    .then(responseWithResult(res, 201))
    .catch(handleError(res));*/

    Registry.findByIdAsync(req.params.id)
      .then(handleEntityNotFound(res))
      .then(function(entity) {
        console.log(req.body)
        entity.products.push(req.body);
        return entity.save(function (err) {
                    if (err) { return handleError(res, err); }
                     return res.status(200).json(entity);
                  });
      })
};


function linkRegistryProduct(res, registryId) {
  return function(entity) {
    var product = entity;
    console.log("inside link registry")
    console.log(registryId)
    return Registry.findByIdAsync(registryId)
      .then(handleEntityNotFound(res))
      .then(function(entity) {
        entity.products.push(product._id);
        return entity.saveAsync().spread(function() {
          return product;
        });
      })
  }
}

//rsvpRegistry

exports.creatersvpRegistry = function(req, res) {
  console.log(req.query)
  Rsvp.create(req.body, function(err, registry) {
    if(err) { return handleError(res, err); }
    
    return res.status(201).json(registry);
  });
};

exports.indexrsvpRegistry = function(req, res) {
      
      
      Rsvp.find({registryId:req.params.id}).exec(function (err, rsvp) {
        if(err) { console.log(err);
          return handleError(res, err); }
          return res.status(200).json(rsvp);
        });
};

exports.createGuestBookRegistry = function(req, res) {
  
  GuestBook.create(req.body, function(err, registry) {
    if(err) { return handleError(res, err); }
    
    return res.status(201).json(registry);
  });
};

exports.indexGuestBookRegistry = function(req, res) {
     
      GuestBook.find({registryId:req.params.id}).exec(function (err, wishes) {
        if(err) { console.log(err);
          return handleError(res, err); }
          return res.status(200).json(wishes);
        });
};

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}
// Updates an existing product in the DB.
exports.update = function(req, res) {
	if(req.body._id) { delete req.body._id; }
 // req.body.uid = req.user.email; // id change on every login hence email is used
 req.body.updated = Date.now();
 if(req.body.name)
 	req.body.nameLower = req.body.name.toString().toLowerCase();
 if(!req.body.slug && req.body.name)
 	req.body.slug = req.body.name.toString().toLowerCase()
                      .replace(/\s+/g, '-')        // Replace spaces with -
                      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                      .replace(/^-+/, '')          // Trim - from start of text
                      .replace(/-+$/, '');

                      Registry.findById(req.params.id, function (err, registry) {
                      	if (err) { return handleError(res, err); }
                      	if(!registry) { return res.status(404).send('Not Found'); }
                      	
                      	var updated = _.extend(registry, req.body);
                      	//console.log(updated);
                      	updated.save(function (err) {
                      		if (err) { return handleError(res, err); }
                      		return res.status(200).json(registry);
                      	});
                      });
                  };

// Deletes a product from the DB.
exports.destroy = function(req, res) {
	Registry.findById(req.params.id, function (err, product) {
		if(err) { return handleError(res, err); }
		if(!product) { return res.status(404).send('Not Found'); }
		product.remove(function(err) {
			if(err) { return handleError(res, err); }
			return res.status(204).send('No Content');
		});
	});
};

exports.search = function(req, res) {
  var term = "/"+req.params.term+"/";
  console.log(term)
      Registry.find({ "title" : { $regex: /term/, $options: 'i' } }).exec(function(err, registries) { 
           if (err){
                res.status(500).json(err);
      		} else {
        console.log(registries)
        res.status(200).json(registries);
      }

       });
};

exports.updatePdtcnt =  function(req, res) {
  
    
     var increment = {
                  $inc: {
                    'products.$.required': 1
                  }
              };
              var query = {
                '_id': req.params.id,
                'products._id': req.body._id
                
              };
              
           Registry.update(query, increment, function(err,registry){
              return res.status(201).json(registry);
           });




};

exports.updateRegistryProduct = function(registryId, productId,quantity){
      var increment = {
                  $inc: {
                    'products.$.required': quantity
                  }
              };
              var query = {
                '_id': registryId,
                'products._id': productId
                
              };
              console.log(quantity)
           Registry.update(query, increment, function(err,registry){
              console.log(err)
           });
}



function handleError(res, err) {
	return res.status(500).send(err);
}





