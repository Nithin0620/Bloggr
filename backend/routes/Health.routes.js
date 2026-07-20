const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const os = require("os");
const { getRedisClient } = require("../configuration/redis");

router.get("/", async (req, res) => {
  const checks = {};
  const startedAt = Date.now();

  // MongoDB
  try {
    const mongoState = mongoose.connection.readyState;
    const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    checks.mongodb = {
      status: mongoState === 1 ? "healthy" : "unhealthy",
      state: states[mongoState] || "unknown",
    };

    if (mongoState === 1) {
      await mongoose.connection.db.admin().ping();
      checks.mongodb.responseTime = `${Date.now() - startedAt}ms`;
    }
  } catch (err) {
    checks.mongodb = { status: "unhealthy", error: err.message };
  }

  // Redis
  const redisClient = getRedisClient();
  if (redisClient) {
    try {
      const redisStart = Date.now();
      await redisClient.ping();
      checks.redis = {
        status: "healthy",
        responseTime: `${Date.now() - redisStart}ms`,
      };
    } catch (err) {
      checks.redis = { status: "unhealthy", error: err.message };
    }
  } else {
    checks.redis = { status: "not_configured" };
  }

  // Memory
  const memUsage = process.memoryUsage();
  checks.memory = {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
  };

  // System
  checks.system = {
    uptime: `${Math.round(os.uptime())}s`,
    processUptime: `${Math.round(process.uptime())}s`,
    platform: os.platform(),
    cpus: os.cpus().length,
    loadAvg: os.loadavg().map((l) => l.toFixed(2)),
  };

  const isHealthy =
    checks.mongodb?.status === "healthy" &&
    (checks.redis?.status === "healthy" || checks.redis?.status === "not_configured");

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "healthy" : "degraded",
    version: process.env.npm_package_version || "1.0.0",
    timestamp: new Date().toISOString(),
    checks,
  });
});

module.exports = router;
