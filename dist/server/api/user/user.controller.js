'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.authCallback = authCallback;
exports.authorize = authorize;
exports.deAuthorize = deAuthorize;
exports.getresetuser = getresetuser;
exports.forgot = forgot;

var _userModel = require('./user.model');

var _userModel2 = _interopRequireDefault(_userModel);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _configEnvironment = require('../../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var async = require('async');
var crypto = require('crypto');
var mail = require('../mail/sendmail');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  };
}

function isJson(str) {
  try {
    str = JSON.parse(str);
  } catch (e) {
    str = str;
  }
  return str;
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function () {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */

function index(req, res, next) {
  if (req.query) {
    var q = isJson(req.query.where);
    _userModel2['default'].find(q).exec(function (err, user) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }

      return res.status(200).json(user);
    });
  } else {
    _userModel2['default'].findAsync({}, '-salt -password').then(function (users) {
      res.status(200).json(users);
    })['catch'](handleError(res));
  }
}

/**
 * Creates a new user
 */

function create(req, res, next) {
  var newUser = new _userModel2['default'](req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.saveAsync().spread(function (user) {
    var token = _jsonwebtoken2['default'].sign({
      _id: user._id
    }, _configEnvironment2['default'].secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({
      token: token
    });
  })['catch'](validationError(res));
}

/**
 * Get a single user
 */

function show(req, res, next) {
  var userId = req.params.id;

  _userModel2['default'].findByIdAsync(userId).then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  })['catch'](function (err) {
    return next(err);
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */

function destroy(req, res) {
  _userModel2['default'].findByIdAndRemoveAsync(req.params.id).then(function () {
    res.status(204).end();
  })['catch'](handleError(res));
}

function changePassword(req, res, next) {

  var userId = req.params.id;

  var newPass = String(req.body.newPassword);

  _userModel2['default'].findOne({ email: userId }).then(function (user) {
    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.status(204).end();
    });
  });
}

/**
 * Get my info
 */

function me(req, res, next) {
  var userId = req.user._id;

  _userModel2['default'].findOneAsync({
    _id: userId
  }, '-salt -password').then(function (user) {
    // don't ever give out the password or salt
    if (!user) {
      return res.status(401).end();
    }
    res.json(user);
  })['catch'](function (err) {
    return next(err);
  });
}

/**
 * Authentication callback
 */

function authCallback(req, res, next) {
  res.redirect('/');
}

/**
 * Add category authorization
 */

function authorize(req, res, next) {
  var userId = req.params._id,
      categoryId = req.body.categoryId;

  _userModel2['default'].findByIdAsync(userId).then(function (user) {
    user.categories.push(categoryId);
    return user.saveAsync().then(function () {
      res.status(204).end();
    })['catch'](validationError(res));
  });
}

/**
 * Remove category authorization
 */

function deAuthorize(req, res, next) {
  var userId = req.params._id,
      categoryId = req.params.cat_id;

  _userModel2['default'].findByIdAsync(userId).then(function (user) {
    user.categories.splice(user.categories.indexOf(categoryId), 1);
    return user.saveAsync().then(function () {
      res.status(204).end();
    })['catch'](validationError(res));
  });
}

function getresetuser(req, res, next) {
  var userId = req.params._id;

  _userModel2['default'].findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
}

exports.count = function (req, res) {

  if (req.query) {
    var q = isJson(req.query.where);
    _userModel2['default'].find(q).count().exec(function (err, count) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }
      return res.status(200).json([{ count: count }]);
    });
  } else {
    _userModel2['default'].count().exec(function (err, count) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }
      return res.status(200).json([{ count: count }]);
    });
  }
};

function forgot(req, res, next) {
  var emailid = String(req.body.id);

  async.waterfall([function (done) {
    crypto.randomBytes(20, function (err, buf) {
      var token = buf.toString('hex');
      done(err, token);
    });
  }, function (token, done) {
    _userModel2['default'].findOne({ email: emailid }, function (err, user) {
      if (!user) {
        return res.status(422).json("Invalid email");
      }
      if (user.provider != 'local') {
        return res.status(422).json("Email Registered with Social authentication");
      }
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      user.save(function (err) {
        done(err, token, user);
      });
    });
  }, function (token, user, done) {
    var users = [{
      'host': req.headers.host,
      'token': token,
      'email': user.email
    }];
    mail.sendmail('forgot', users);
    return res.status(200).json("success");
  }], function (err) {
    validationError(res);
  });
}
//# sourceMappingURL=user.controller.js.map
