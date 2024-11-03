require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('./config/passportConfig'); // Import passport configuration

const app = express();

// Middleware
app.use(express.static('views')); // Serve static files from views
app.use(express.urlencoded({ extended: true }));

// Set up session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
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
