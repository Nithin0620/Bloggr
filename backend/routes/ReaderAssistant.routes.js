const express = require("express");
const router = express.Router();
const { askAboutArticle, summarizeArticle } = require("../controllers/ReaderAssistant");

router.post("/ask", askAboutArticle);
router.post("/summarize", summarizeArticle);

module.exports = router;
