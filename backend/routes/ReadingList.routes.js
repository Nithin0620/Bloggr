const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const { writeLimiter, generalLimiter } = require("../middlewares/rateLimiter")
const {
  createReadingListValidation,
  updateReadingListValidation,
  mongoIdParamValidation,
} = require("../middlewares/validate")

const {
  createReadingList,
  getMyReadingLists,
  getReadingListById,
  updateReadingList,
  deleteReadingList,
  addPostToList,
  removePostFromList,
} = require("../controllers/ReadingList")

router.post("/create", protectRoute, writeLimiter, createReadingListValidation, createReadingList);
router.get("/mylists", protectRoute, generalLimiter, getMyReadingLists);
router.get("/:id", generalLimiter, mongoIdParamValidation("id"), getReadingListById);
router.put("/:id", protectRoute, writeLimiter, updateReadingListValidation, updateReadingList);
router.delete("/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), deleteReadingList);
router.post("/:listId/addpost/:postId", protectRoute, writeLimiter, mongoIdParamValidation("listId"), mongoIdParamValidation("postId"), addPostToList);
router.delete("/:listId/removepost/:postId", protectRoute, writeLimiter, mongoIdParamValidation("listId"), mongoIdParamValidation("postId"), removePostFromList);

module.exports = router;
