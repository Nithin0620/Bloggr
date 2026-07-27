const express = require("express");
const router = express.Router();
const { askRagChat } = require("../controllers/RagChat");

router.post("/ask", askRagChat);

module.exports = router;
