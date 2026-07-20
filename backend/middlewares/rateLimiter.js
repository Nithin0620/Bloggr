const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = rateLimit;
const { RedisStore } = require("rate-limit-redis");
const Redis = require("ioredis");

// ─── Redis client setup ─────────────────────────────────
let redisClient = undefined;

if (process.env.REDIS_URL) {
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
        console.error("Redis rate-limit error:", err.message);
      }
    });

    redisClient.on("close", () => {
      console.warn("⚠ Redis connection lost, falling back to in-memory store");
    });

    console.log("✓ Redis rate-limit client initialized");
  } catch (err) {
    console.warn("⚠ Redis unavailable, using in-memory rate-limit store");
    redisClient = undefined;
  }
}

// ─── Factory: create a store per limiter ────────────────
function createStore(prefix) {
  if (!redisClient) return undefined;
  return new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
    prefix: `rl:${prefix}:`,
  });
}

// ─── Key generator ──────────────────────────────────────
const userKeyGenerator = (req, res) => {
  const userId = req.user?.user?._id;
  if (userId) return `user:${userId}`;
  return `ip:${ipKeyGenerator(req, res)}`;
};

// ─── Limiters ───────────────────────────────────────────
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: { success: false, message: "Too many attempts, try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
  store: createStore("auth"),
});

exports.otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 4,
  message: { success: false, message: "Too many OTP requests, try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
  store: createStore("otp"),
});

exports.writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many requests, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
  store: createStore("write"),
});

exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { success: false, message: "Too many requests, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
  store: createStore("general"),
});
