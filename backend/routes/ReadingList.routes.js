const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")

const {
  createReadingList,
  getMyReadingLists,
  getReadingListById,
  updateReadingList,
  deleteReadingList,
  addPostToList,
  removePostFromList,
} = require("../controllers/ReadingList")

router.post("/create", protectRoute, createReadingList);
router.get("/mylists", protectRoute, getMyReadingLists);
router.get("/:id", getReadingListById);
router.put("/:id", protectRoute, updateReadingList);
router.delete("/:id", protectRoute, deleteReadingList);
router.post("/:listId/addpost/:postId", protectRoute, addPostToList);
router.delete("/:listId/removepost/:postId", protectRoute, removePostFromList);

module.exports = router;
