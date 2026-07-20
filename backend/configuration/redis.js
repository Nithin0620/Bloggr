const Redis = require("ioredis");
const logger = require("./logger");

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
        logger.error("Redis error", { error: err.message });
      }
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected");
    });

    redisClient.on("close", () => {
      logger.warn("Redis connection lost");
    });
  } catch (err) {
    logger.warn("Redis unavailable", { error: err.message });
    redisClient = null;
  }

  return redisClient;
}

module.exports = { getRedisClient };
