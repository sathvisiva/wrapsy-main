'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
var async = require('async');
var crypto = require('crypto');
var mail = require('../mail/sendmail');


function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

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
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
 export function index(req, res, next) {
  if(req.query){
    var q = isJson(req.query.where);
    User.find(q).exec(function (err, user) {
      if(err) { console.log(err);
        return handleError(res, err); }

        return res.status(200).json(user);
      });
  }else{
    User.findAsync({}, '-salt -password')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
  }
}

/**
 * Creates a new user
 */
 export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.saveAsync()
  .spread(function(user) {
    var token = jwt.sign({
      _id: user._id
    }, config.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({
      token
    });
  })
  .catch(validationError(res));
}

/**
 * Get a single user
 */
 export function show(req, res, next) {
  var userId = req.params.id;

  User.findByIdAsync(userId)
  .then(user => {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  })
  .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
 export function destroy(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
  .then(function() {
    res.status(204).end();
  })
  .catch(handleError(res));
}

/**
 * Change a users password
 */
 export function changePassword(req, res, next) {

  var token = req.params.token;
  var newPass = String(req.body.newPassword);

  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
  .then(user => {
    console.log(user)
    user.password = newPass;
    return user.saveAsync()
    .then(() => {
      res.status(204).end();
    })
    .catch(validationError(res));

  });
}

/**
 * Get my info
 */
 export function me(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({
    _id: userId
  }, '-salt -password')
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
  }

/**
 * Authentication callback
 */
 export function authCallback(req, res, next) {
  res.redirect('/');
}

/**
 * Add category authorization
 */
 export function authorize(req, res, next) {
  var userId = req.params._id,
  categoryId = req.body.categoryId;

  User.findByIdAsync(userId)
  .then(user => {
    user.categories.push(categoryId);
    return user.saveAsync()
    .then(() => {
      res.status(204).end();
    })
    .catch(validationError(res));
  });
}

/**
 * Remove category authorization
 */
 export function deAuthorize(req, res, next) {
  var userId = req.params._id,
  categoryId = req.params.cat_id;

  User.findByIdAsync(userId)
  .then(user => {
    user.categories.splice(user.categories.indexOf(categoryId), 1);
    return user.saveAsync()
    .then(() => {
      res.status(204).end();
    })
    .catch(validationError(res));
  });
}

export function getresetuser(req, res, next) {
  var userId = req.params._id;
  

  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });

}


function sendMail(to, host, token){
  var connection = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'admin@wrapsytest.com',
      pass: 'SS@thTinku'
    }
  });

  var email = {
      from: '"Wrapsy" <admin@wrapsytest.com>',  // this email account should be the same as before auth.user
      to: to, // recipient, passed as parameter to the function
      subject: 'Password reset', // subject, passed as parameter to the function
      html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n' // template, passed as parameter to the function
        };

        connection.sendMail(email);

      }

      export function forgot(req, res, next) {
        var emailid = String(req.body.id);
        console.log(emailid)

        async.waterfall([
          function(done) {
            crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              done(err, token);
            });
          },
          function(token, done) {
            User.findOne({ email: emailid }, function(err, user) {
              if (!user) {
                return res.status(422).json("Invalid email");
              }
              if(user.provider != 'local'){
                return res.status(422).json("Email Registered with Social authentication");
              }
              console.log(user);
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
              user.save(function(err) {
                done(err, token, user);
              });
            });
          },
          function(token, user, done) {
           let users = [
           {
            'host': req.headers.host,
            'token' : token,
            'email': user,
          }
          ];
          mail.sendmail('forgot',users);
            //sendMail(user, req.headers.host , token);

          }
          ],function(err) {
            validationError(res)
          });
      }
