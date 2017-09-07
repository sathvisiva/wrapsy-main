'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.setup = setup;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportGoogleOauth = require('passport-google-oauth');

function setup(User, config) {
  _passport2['default'].use(new _passportGoogleOauth.OAuth2Strategy({
    //339525367862-c3dfgunh3i23csv6onvn5fetroboma85.apps.googleusercontent.com
    clientID: "339525367862-3d0leu38ihrp09oja6jqgdb98in1g6p0.apps.googleusercontent.com",
    //2t4rbI0fl9Rfu6ldH3v9xFnR
    clientSecret: "WvuIlCoYJZujMXvNXhGfdoUn",
    callbackURL: config.google.callbackURL
  }, function (accessToken, refreshToken, profile, done) {

    User.findOneAsync({
      'google.id': profile.id
    }).then(function (user) {
      if (user) {

        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        role: 'user',
        username: profile.emails[0].value.split('@')[0],
        provider: 'google',
        google: profile._json
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
