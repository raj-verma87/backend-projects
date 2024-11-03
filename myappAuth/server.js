require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('./config/passportConfig'); // Import passport configuration

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.static('views')); // Serve static files from views
app.use(express.urlencoded({ extended: true }));

// Set up session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
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

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
