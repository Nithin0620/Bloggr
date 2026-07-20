const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middlewares/auth.middleware");
const { writeLimiter } = require("../middlewares/rateLimiter");
const { aiWrite, aiGenerateMeta } = require("../controllers/AI");

router.post("/write", protectRoute, writeLimiter, aiWrite);
router.post("/generate-meta", protectRoute, writeLimiter, aiGenerateMeta);

module.exports = router;
