const { getRedisClient } = require("../configuration/redis");

const DEFAULT_TTL = 60;

function cacheMiddleware(keyPrefix, ttlSeconds = DEFAULT_TTL) {
  return async (req, res, next) => {
    const client = getRedisClient();
    if (!client) return next();

    const cacheKey = `cache:${keyPrefix}:${req.originalUrl}`;

    try {
      const cached = await client.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return res.status(200).json(parsed);
      }
    } catch (err) {
      // cache miss — continue to handler
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        client.setex(cacheKey, ttlSeconds, JSON.stringify(body)).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
}

async function flushCache(pattern) {
  const client = getRedisClient();
  if (!client) return;

  try {
    const keys = await client.keys(`cache:${pattern}:*`);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (err) {
    // silent fail — cache invalidation is best-effort
  }
}

module.exports = { cacheMiddleware, flushCache };
