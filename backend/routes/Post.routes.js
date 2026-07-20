const express = require("express")
const router  = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const upload = require("../middlewares/multer")
const { writeLimiter, generalLimiter } = require("../middlewares/rateLimiter")
const { cacheMiddleware } = require("../middlewares/cache")
const {
  createPostValidation,
  updatePostValidation,
  mongoIdParamValidation,
} = require("../middlewares/validate")

const {
   createPost,
   updatePost,
   deletePost,
   getAllPosts,
   getPostById,
   getPostByCategory,
   getPostByUser,
   getScheduledPosts
} = require("../controllers/Post")

router.post("/createpost", protectRoute, writeLimiter, upload.single("image"), createPostValidation, createPost);
router.put("/updatepost/:id", protectRoute, writeLimiter, upload.single("image"), updatePostValidation, updatePost);
router.delete("/deletepost/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), deletePost);
router.get("/getallposts", generalLimiter, cacheMiddleware("posts", 30), getAllPosts)
router.get("/getscheduledposts", protectRoute, generalLimiter, getScheduledPosts)
router.get("/getpostbyid/:id", generalLimiter, mongoIdParamValidation("id"), getPostById);
router.get("/getpostbycategory/:category", generalLimiter, cacheMiddleware("posts:category", 30), getPostByCategory);
router.get("/getpostbyuser/:id", generalLimiter, mongoIdParamValidation("id"), getPostByUser);

module.exports = router;
