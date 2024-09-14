import { Server,Socket } from 'socket.io';
import http from 'http';

let io: Server;

export const initializeSocket = (server: http.Server) => {
  // Set up Socket.io server
io = new Server(server);

// WebSocket connection handler
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Emit a sample order status update
  socket.emit('orderStatusUpdate', { message: 'Your order has been confirmed!' });

  // Listen for joining a room (based on user ID)
  socket.on('joinRoom', (userId: string) => {
    console.log(`User with ID ${userId} joined the room`);
    socket.join(userId);
  });

  // Broadcast messages to all clients (example)
  socket.on('sendMessage', (message: { text: string; room: string }) => {
    console.log("sendMessage111...");
    io.to(message.room).emit('orderStatusUpdate', { message: message.text });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
}
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

