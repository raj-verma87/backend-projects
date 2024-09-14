import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3030'; // Replace with your server URL

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// Function to connect and listen for events
const connectSocket = (userId) => {
  // Connect to the WebSocket server
  socket.connect();

  // Join a specific room (e.g., the user's room)
  socket.emit('joinRoom', userId);

  // Listen for notifications
  socket.on('notification', (data) => {
    console.log('New Notification:', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
};

export { socket, connectSocket };
