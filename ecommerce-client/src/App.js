import React, { useEffect } from 'react';
import {socket, connectSocket } from './services/socket';

function App() {
  const userId = 'USER_ID'; // Replace with the actual user ID

  useEffect(() => {
    // Connect to WebSocket when the component mounts
    connectSocket(userId);

    // Optionally disconnect on component unmount
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div className="App">
      <h1>Real-Time Notifications</h1>
    </div>
  );
}

export default App;
