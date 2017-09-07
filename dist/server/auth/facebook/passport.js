'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.setup = setup;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

function setup(User, config) {
  _passport2['default'].use(new _passportFacebook.Strategy({
    clientID: "740319199474993",
    clientSecret: "424a718b6c70005d629f7054769f9f21",
    callbackURL: config.facebook.callbackURL,
    profileFields: ['displayName', 'emails']
  }, function (accessToken, refreshToken, profile, done) {
    User.findOneAsync({
      'facebook.id': profile.id
    }).then(function (user) {
      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        role: 'user',
        provider: 'facebook',
        facebook: profile._json
      });
      user.saveAsync().then(function (user) {
        return done(null, user[0]);
      })['catch'](function (err) {
        return done(err);
      });
    })['catch'](function (err) {
      return done(err);
    });
  }));
}
//# sourceMappingURL=passport.js.map