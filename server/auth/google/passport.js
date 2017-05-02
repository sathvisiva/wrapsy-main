import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';

export function setup(User, config) {
  passport.use(new GoogleStrategy({
    clientID: "339525367862-3d0leu38ihrp09oja6jqgdb98in1g6p0.apps.googleusercontent.com",
    clientSecret: "WvuIlCoYJZujMXvNXhGfdoUn",
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOneAsync({
      'google.id': profile.id
    })
      .then(user => {
        if (user) {
        	console.log("insdie find if")
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
        user.saveAsync()
          .then(user => {
          	console.log("inside save if")
          	done(null, user)
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
