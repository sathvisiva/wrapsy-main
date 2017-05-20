import passport from 'passport';
import {Strategy as TwitterStrategy} from 'passport-twitter';

export function setup(User, config) {
  passport.use(new TwitterStrategy({
    consumerKey: "7vVbDeKyA88NiLyRJoHqScDou",
    consumerSecret: "YZWgTdHggBWrQlqLyp5uQiTULfLSobHLOOapKnsr7bVBIa2OCH",
    callbackURL: config.twitter.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    User.findOneAsync({
      'twitter.id_str': profile.id
    })
      .then(user => {
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
        user.saveAsync()
          .then(user => done(null, user[0]))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
