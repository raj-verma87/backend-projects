import { createClient } from 'redis';

import dotenv from 'dotenv';
dotenv.config();


const client = createClient({ url: process.env.REDIS_URL });

// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => console.error('Redis error: ', err));

client.connect();

export default client;
