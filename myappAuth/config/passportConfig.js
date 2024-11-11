const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { saveUserSession, getUserSession,deleteAllUserSessions } = require('../models/UserSession');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const userData = {
        providerId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0]?.value || '',
        picture: profile.photos[0]?.value || '',
        provider: 'google',
      };
  
      // Set file path for the downloaded image
      const filePath = path.join(__dirname,'..', 'profile_pictures', `${userData.providerId}.jpg`);

      // Check if the image already exists locally
      if (!fs.existsSync(filePath)) {
        // Download the profile picture
        const response = await axios.get(userData.picture, { responseType: 'stream' });
        await fs.ensureDir(path.dirname(filePath)); // Ensure the directory exists
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        // Wait for the download to finish
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      }

      // Add the local file path to the user data
      userData.picture = `/profile_pictures/${userData.providerId}.jpg`;

       // Delete any existing session for the user
       await deleteAllUserSessions(profile.id);
      
       // Save new session for the user
       await saveUserSession(profile.id, userData);
       return done(null, userData);
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
      const userData = {
        providerId: profile.id,
        displayName: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        picture: profile.photos?.[0]?.value,
        provider: 'github',
      };
  
      // Save to Redis
      await saveUserSession(profile.id, userData);
      done(null, userData);
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
    const userData = {
      providerId: profile.id,
      displayName: profile.displayName,
      email: profile.emails ? profile.emails[0].value : null,
      picture: profile.photos?.[0]?.value,
      provider: 'facebook',
    };

    // Save to Redis
    await saveUserSession(profile.id, userData);
    done(null, userData);
  }
));

// Serialize and deserialize user information to/from the session
passport.serializeUser((user, done) => {
  // Store the user ID in the session
  done(null, user.providerId);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserSession(id);
    console.log('User Data:',user);
    done(null, user); // Pass the full user data
  } catch (err) {
    done(err);
  }
});