'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.setup = setup;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportTwitter = require('passport-twitter');

function setup(User, config) {
  _passport2['default'].use(new _passportTwitter.Strategy({
    consumerKey: "7vVbDeKyA88NiLyRJoHqScDou",
    consumerSecret: "YZWgTdHggBWrQlqLyp5uQiTULfLSobHLOOapKnsr7bVBIa2OCH",
    callbackURL: config.twitter.callbackURL
  }, function (token, tokenSecret, profile, done) {
    User.findOneAsync({
      'twitter.id_str': profile.id
    }).then(function (user) {
      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        username: profile.username,
        role: 'user',
        provider: 'twitter',
        twitter: profile._json
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