// src/App.tsx
import React, { useState } from 'react';
import Login from './components/Login';
import Notifications from './components/Notifications';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <h1>Real-Time Notifications with React and Socket.io</h1>
      {isLoggedIn ? <Notifications /> : <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default App;
