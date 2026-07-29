const express = require("express");
const router = express.Router();
const { getAuthorDashboard, getAIInsights } = require("../controllers/Analytics");
const { protectRoute } = require("../middlewares/auth.middleware");

router.get("/dashboard", protectRoute, getAuthorDashboard);
router.get("/insights", protectRoute, getAIInsights);

module.exports = router;
