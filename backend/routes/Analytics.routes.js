const express = require("express");
const router = express.Router();
const { getAuthorDashboard } = require("../controllers/Analytics");
const { protectRoute } = require("../middlewares/auth.middleware");

router.get("/dashboard", protectRoute, getAuthorDashboard);

module.exports = router;
