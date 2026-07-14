const redisClient = require("../config/redis");

async function getCache(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
}

async function setCache(key, value, expiry = 60*60*24) {
    await redisClient.set(
        key,
        JSON.stringify(value),
        {
            EX: expiry
        }
    );
}

module.exports = {
    getCache,
    setCache
};