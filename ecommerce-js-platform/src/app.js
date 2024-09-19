const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const { getIO } = require('./socket');
const { authMiddleware } = require('./middlewares/auth.middleware');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./utils/logger');
const path = require('path');
const { globalLimiter } = require('./middlewares/rateLimit.middleware');

dotenv.config();

const app = express();

// Use the CORS middleware
app.use(cors({
  origin: 'http://localhost:3030'  // This allows requests from your React app.
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Middleware to log each request
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/', globalLimiter);

// Add this API route to trigger a real-time notification
app.post('/api/notify', (req, res) => {
  const io = getIO();
  const { userId, message } = req.body;

  if (userId) {
    // Emit the message to a specific user room
    io.to(userId).emit('orderStatusUpdate', { message });
  } else {
    // Broadcast the message to all connected clients
    io.emit('orderStatusUpdate', { message });
  }

  res.status(200).json({ message: 'Notification sent successfully' });
});

app.get('/api/userId', authMiddleware, (req, res) => {
  const userId = req.user ? req.user._id : 'guest'; // Extract userId from JWT or session
  res.json({ userId });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  logger.info('Homepage accessed');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  // res.send('Welcome to the E-Commerce Platform');
});

// Simulating an error
app.get('/error', (req, res) => {
  const error = new Error('Something went wrong!');
  logger.error(`Error occurred: ${error.message}`);
  res.status(500).send('An error occurred');
});

// Error-handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).send('Server Error');
});

app.use(errorMiddleware);

module.exports = app;
