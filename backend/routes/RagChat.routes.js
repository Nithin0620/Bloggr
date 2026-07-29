const express = require("express");
const router = express.Router();
const { ask, getSessions, getSessionHistory } = require("../controllers/RagChat");
const { protectRoute } = require("../middlewares/auth.middleware");

router.post("/ask", protectRoute, ask);
router.get("/sessions", protectRoute, getSessions);
router.get("/history/:sessionId", protectRoute, getSessionHistory);

module.exports = router;
