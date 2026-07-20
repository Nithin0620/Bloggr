const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middlewares/auth.middleware");
const { writeLimiter, generalLimiter } = require("../middlewares/rateLimiter");
const { mongoIdParamValidation } = require("../middlewares/validate");

const {
  toggleBookmark,
  getBookmarks,
  getBookmarkedPostIds,
} = require("../controllers/Bookmark");

router.put("/toggle/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), toggleBookmark);
router.get("/getall", protectRoute, generalLimiter, getBookmarks);
router.get("/getids", protectRoute, generalLimiter, getBookmarkedPostIds);

module.exports = router;
