const { createClient } = require("redis");

const redisClient = createClient({
    url:process.env.REDIS_URL
});

redisClient.on("error", (err) => {
    // console.error("Redis Error:", err);
});

redisClient.on("connect", () => {
});

module.exports = redisClient;