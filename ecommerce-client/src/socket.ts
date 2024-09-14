// src/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (token: string) => {
  socket = io('http://localhost:3000', {
    auth: {
      token: `Bearer ${token}`
    }
  });

  socket.on('connect', () => {
    console.log('Connected to server with Socket ID:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('orderStatusUpdate', (data: { message: string }) => {
    console.log('Order status update:', data.message);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};
