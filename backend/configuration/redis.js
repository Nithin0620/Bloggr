const Redis = require("ioredis");

let redisClient = null;

function getRedisClient() {
  if (redisClient) return redisClient;

  if (!process.env.REDIS_URL) return null;

  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableOfflineQueue: true,
      retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 200, 3000);
      },
    });

    redisClient.on("error", (err) => {
      if (!err.message.includes("ECONNRESET")) {
        console.error("Redis error:", err.message);
      }
    });

    redisClient.on("connect", () => {
      console.log("✓ Redis connected");
    });

    redisClient.on("close", () => {
      console.warn("⚠ Redis connection lost");
    });
  } catch (err) {
    console.warn("⚠ Redis unavailable:", err.message);
    redisClient = null;
  }

  return redisClient;
}

module.exports = { getRedisClient };
