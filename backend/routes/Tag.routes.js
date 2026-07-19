const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")

const {
  createTag,
  getAllTags,
  getPostsByTag,
  deleteTag,
} = require("../controllers/Tag")

router.post("/create", protectRoute, createTag);
router.get("/getall", getAllTags);
router.get("/getpostsbytag/:tagId", getPostsByTag);
router.delete("/:id", protectRoute, deleteTag);

module.exports = router;
