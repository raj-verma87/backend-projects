const express = require('express');
const passport = require('passport');
const { deleteUserSession,deleteAllUserSessions } = require('../models/UserSession');

const router = express.Router();

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile']}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/auth/profile');
  }
);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    console.log("google/callback...",req.user);
    res.redirect('/auth/profile');
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/auth/profile');
  }
);

// Route for logout
router.get('/logout', async (req, res, next) => {
  try {
    const userId = req.user.providerId; // Assuming user ID is available in `req.user`
    const sessionId = req.sessionID; // Use the current session ID

    // Option 1: Delete the session data for the specific session from Redis
   // await deleteUserSession(userId, sessionId);

    // Option 2: Clear all sessions for the user (complete logout)
    await deleteAllUserSessions(userId);

    // Logout the user using passport
    req.logout((err) => {
      console.log('User logout:');
      if (err) {
        return next(err);
      }

      // Destroy the session
      req.session.destroy((err) => {
        console.log('User destroy:');
        if (err) {
          console.error('Session destruction error:', err);
          return res.redirect('/');
        }

        // Clear the session cookie from the client
        res.clearCookie('connect.sid', { path: '/' });

        // Redirect to the home page
        res.redirect('/');
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.redirect('/');
  }
});










// Profile route (protected)
router.get('/profile', (req, res) => {
 // console.log('User Data:', req.user);
  if (req.isAuthenticated()) {

    if (!req.session.userData) {
      req.session.userData = req.user; // Store user data in the session
    }

    // Access user data in req.user
  const user = req.user;
 // console.log('user User Data:',user.displayName);
  // Safely check if the user has a profile picture
  if (!user.picture && user.photos && user.photos.length > 0) {
    user.picture = user.photos[0].value;
  }
  // Set the profile picture to user's picture or use the placeholder
  const profilePicture = user.picture || 'https://via.placeholder.com/100';
  console.log("picture:",profilePicture);

  res.send(`
    <h1>Welcome, ${user.displayName}</h1>
    <p>Name: ${user.firstName} ${user.lastName}</p>
    <p>Email: ${user.email}</p>
    <p><img src="${profilePicture}" alt="Profile Picture" style="width:100px;height:100px;border-radius:50%;"></p>
    <p><a href="/">Go To Home</a></p>
    <p><a href="/auth/logout">Logout</a></p>
  `);
  } else {
    console.log("isAuthenticated...",req.isAuthenticated());
    res.redirect('/');
  
}
});

module.exports = router;
