// src/components/Notifications.tsx
import React, { useEffect, useState } from 'react';
import { connectSocket } from '../socket';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      const socket = connectSocket(token);

      socket.on('orderStatusUpdate', (data: { message: string }) => {
        setNotifications((prev) => [...prev, data.message]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  return (
    <div>
      <h2>Order Status Notifications</h2>
      <ul>
        {notifications.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
