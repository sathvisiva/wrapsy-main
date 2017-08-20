import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';

export function setup(User, config) {
  passport.use(new GoogleStrategy({
    //339525367862-c3dfgunh3i23csv6onvn5fetroboma85.apps.googleusercontent.com
    clientID: "339525367862-3d0leu38ihrp09oja6jqgdb98in1g6p0.apps.googleusercontent.com",
    //2t4rbI0fl9Rfu6ldH3v9xFnR
    clientSecret: "WvuIlCoYJZujMXvNXhGfdoUn",
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOneAsync({
      'google.id': profile.id
    })
      .then(user => {
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
        user.saveAsync()
          .then(user => {
          	
          	return done(null, user[0])
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}

