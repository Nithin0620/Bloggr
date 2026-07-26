const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middlewares/auth.middleware");
const { writeLimiter } = require("../middlewares/rateLimiter");
const { aiWrite, aiGenerateMeta, aiSuggestCategories, aiSummarize, aiSuggestComment, aiSentimentScore, aiSearch, aiGenerateBio } = require("../controllers/AI");

router.post("/write", protectRoute, writeLimiter, aiWrite);
router.post("/generate-meta", protectRoute, writeLimiter, aiGenerateMeta);
router.post("/suggest-categories", protectRoute, writeLimiter, aiSuggestCategories);
router.post("/summarize", protectRoute, writeLimiter, aiSummarize);
router.post("/suggest-comment", protectRoute, writeLimiter, aiSuggestComment);
router.post("/sentiment-score", protectRoute, writeLimiter, aiSentimentScore);
router.post("/search", protectRoute, writeLimiter, aiSearch);
router.post("/generate-bio", protectRoute, writeLimiter, aiGenerateBio);

module.exports = router;
