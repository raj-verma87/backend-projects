import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import { getIO } from './socket';
import authMiddleware from './middlewares/auth.middleware';
import cors from 'cors';

const path = require('path');

dotenv.config();

const app = express();

 //app.use(cors());  // This allows requests from any domain.

//Use the CORS middleware
app.use(cors({
  origin: 'http://localhost:3030'  // This allows requests from your React app.
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders',orderRoutes);

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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
 // res.send('Welcome to the E-Commerce Platform');
});
export default app;


