// models/UserSession.js

const Redis = require('ioredis');
const redisClient = new Redis(); // Default configuration connects to localhost

// Helper function to save user session data in Redis
async function saveUserSession(userId, userData) {
  // Save user data with an expiration of 1 day (adjust as needed)
  await redisClient.set(`user:${userId}`, JSON.stringify(userData), 'EX', 86400);
}

// Helper function to retrieve user session data from Redis
async function getUserSession(userId) {
  const data = await redisClient.get(`user:${userId}`);
  return data ? JSON.parse(data) : null;
}

// Helper function to delete user session data from Redis
async function deleteUserSession(userId) {
  await redisClient.del(`user:${userId}`);
}

module.exports = { saveUserSession, getUserSession, deleteUserSession };
