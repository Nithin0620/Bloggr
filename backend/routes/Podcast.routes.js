const express = require("express");
const router = express.Router();
const { generatePodcast } = require("../controllers/Podcast");

router.post("/generate", generatePodcast);

module.exports = router;
