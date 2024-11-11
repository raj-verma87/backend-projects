require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
require('./config/passportConfig'); // Import passport configuration
const path = require('path');
const app = express();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL // Ensure this is the correct connection string
});

redisClient.connect().catch(err => {
  console.error('Redis connection error:', err);
});

// Check for errors and connection readiness
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('ready', () => {
  console.log('Redis client is ready to use.');
});

// Middleware
app.use(express.static('views')); // Serve static files from views
app.use(express.urlencoded({ extended: true }));

// Set up session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
      client: redisClient,
      ttl: 1 * 60 * 60 // Session expiration in seconds (1 hours here)
    }),
    cookie: {                   // Session cookie settings
      maxAge: 1000 * 60 * 60,   // Session expires after 1 hour (in ms)
      httpOnly: true,           // JavaScript can't access the cookie (mitigates XSS attacks)
    },
  })
);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Import and use authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Serve profile pictures from the 'profile_pictures' directory
app.use('/profile_pictures', express.static(path.join(__dirname, 'profile_pictures')));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
