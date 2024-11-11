const Redis = require('ioredis');
const redisClient = new Redis();

// Save user session, ensuring only one session is stored per user
async function saveUserSession(userId, userData) {
  // Create or update user session with an expiration time
  await redisClient.set(`user:${userId}:session`, JSON.stringify(userData), 'EX', 86400);
}

// Get user session
async function getUserSession(userId) {
  const data = await redisClient.get(`user:${userId}:session`);
  return data ? JSON.parse(data) : null;
}

// Delete all sessions for a specific user
async function deleteAllUserSessions(userId) {
  await redisClient.del(`user:${userId}:session`);
}

module.exports = { saveUserSession, getUserSession, deleteAllUserSessions };
