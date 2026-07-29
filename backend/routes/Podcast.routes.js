const express = require("express");
const router = express.Router();
const { generatePodcast, getPodcastStatus, getPodcast } = require("../controllers/Podcast");
const { protectRoute } = require("../middlewares/auth.middleware");

router.post("/generate", protectRoute, generatePodcast);
router.get("/status/:articleId", protectRoute, getPodcastStatus);
router.get("/:articleId", protectRoute, getPodcast);

module.exports = router;
