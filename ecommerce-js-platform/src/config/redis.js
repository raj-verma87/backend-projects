const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const client = redis.createClient({ url: process.env.REDIS_URL });

// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => console.error('Redis error: ', err));

client.connect();

module.exports = client;
