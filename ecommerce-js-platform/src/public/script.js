const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const notificationsSection = document.getElementById('notificationsSection');
const loginMessage = document.getElementById('loginMessage');
const notificationsDiv = document.getElementById('notifications');

// Decode JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// Check if the token is expired
function isTokenExpired(token) {
  if (!token) return true;

  const decodedToken = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  return decodedToken.exp < currentTime; // Check if token is expired
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Send login request to the backend
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the JWT token in localStorage
      localStorage.setItem('token', data.token);

      // Display login success message
      loginMessage.textContent = 'Login successful!';

      // Hide login section and show notifications section
      loginSection.style.display = 'none';
      notificationsSection.style.display = 'block';

      // Connect to the WebSocket server and listen for order status updates
      connectSocket();
    } else {
      loginMessage.textContent = 'Login failed: ' + data.message;
    }
  } catch (error) {
    console.error('Error:', error);
    loginMessage.textContent = 'An error occurred during login.';
  }
});

// Function to connect to the WebSocket server and listen for order status updates
function connectSocket() {
  const token = localStorage.getItem('token');

  // Check if token is expired before connecting to the WebSocket
  if (!token || isTokenExpired(token)) {
    loginMessage.textContent = 'Session expired. Please log in again.';
    localStorage.removeItem('token');
    loginSection.style.display = 'block';
    notificationsSection.style.display = 'none';
    return;
  }

  const socket = io('http://localhost:3000', {
    query: { token },  // Send token to the server via query parameter
  });

  // Listen for order status updates
  socket.on('orderStatusUpdate', (data) => {
    console.log('Order status update:', data.message);
    notificationsDiv.innerHTML += `<p>${data.message}</p>`;
  });

  // Optionally join a room with the user's ID (after fetching from API)
  fetch('http://localhost:3000/api/userId', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,  // Send token in the Authorization header
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Unauthorized');
    }
    return response.json();
  })
  .then(data => {
    if (data.userId) {
      socket.emit('joinRoom', data.userId);  // Use the user's ID to join a room
      console.log('Joined room with user ID:', data.userId);
    }
  })
  .catch(error => {
    console.error('Error fetching user ID:', error);
    loginMessage.textContent = 'Failed to fetch user ID.';
  });
}

// Check if already logged in
window.onload = () => {
  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    // Hide login section and show notifications section
    loginSection.style.display = 'none';
    notificationsSection.style.display = 'block';

    // Connect to the WebSocket server if token is valid
    connectSocket();
  } else {
    // Show the login form if not logged in or token is expired
    loginSection.style.display = 'block';
    notificationsSection.style.display = 'none';
  }
};
