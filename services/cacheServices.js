const redisClient = require("../config/redis");

async function getCache(key) {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.log("Redis unavailable, skipping cache read");
        return null;
    }
}

async function setCache(key, value, expiry = 60 * 60 * 24) {
    try {
        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX: expiry
            }
        );
    } catch (error) {
        console.log("Redis unavailable, skipping cache write");
    }
}

module.exports = {
    getCache,
    setCache
};