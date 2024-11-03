const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
         // Upsert operation: update if exists, create if not
         const user = await User.findOneAndUpdate(
          { provider: 'google', providerId: profile.id },
          {
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails ? profile.emails[0].value : null,
            picture: profile.photos?.[0]?.value,
          },
          { upsert: true, new: true } // upsert creates a new user if none found
        );
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_GITHUB_URL}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { provider: 'github', providerId: profile.id },
          {
            displayName: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null,
            picture: profile.photos?.[0]?.value,
          },
          { upsert: true, new: true }
        );
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.CALLBACK_FACEBOOK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOneAndUpdate(
        { provider: 'facebook', providerId: profile.id },
        {
          displayName: profile.displayName,
          email: profile.emails ? profile.emails[0].value : null,
          picture: profile.photos?.[0]?.value,
        },
        { upsert: true, new: true }
      );
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

// Serialize and deserialize user information to/from the session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
// passport.serializeUser((user, done) =>{
//   console.log("User to serialize:", user);
//    done(null, user._id)
//   });
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (error) {
//       done(error, null);
//     }
//   });