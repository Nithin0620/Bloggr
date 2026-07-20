const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const { writeLimiter, generalLimiter } = require("../middlewares/rateLimiter")
const {
  createTagValidation,
  mongoIdParamValidation,
} = require("../middlewares/validate")

const {
  createTag,
  getAllTags,
  getPostsByTag,
  deleteTag,
} = require("../controllers/Tag")

router.post("/create", protectRoute, writeLimiter, createTagValidation, createTag);
router.get("/getall", generalLimiter, getAllTags);
router.get("/getpostsbytag/:tagId", generalLimiter, mongoIdParamValidation("tagId"), getPostsByTag);
router.delete("/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), deleteTag);

module.exports = router;
