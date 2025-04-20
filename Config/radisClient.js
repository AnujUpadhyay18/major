// redisClient.js
const { createClient } = require('redis');
const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Error:', err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
