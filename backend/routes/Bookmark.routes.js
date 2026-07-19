const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middlewares/auth.middleware");

const {
  toggleBookmark,
  getBookmarks,
  getBookmarkedPostIds,
} = require("../controllers/Bookmark");

router.put("/toggle/:id", protectRoute, toggleBookmark);
router.get("/getall", protectRoute, getBookmarks);
router.get("/getids", protectRoute, getBookmarkedPostIds);

module.exports = router;
