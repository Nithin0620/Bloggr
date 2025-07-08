const express = require("express")
const router  = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")

const {
   createPost,
   updatePost,
   deletePost,
   getAllPosts,
   getPostById,
   getPostByCategory,
   getPostByUser
} = require("../controllers/Post")

router.post("/createpost",protectRoute,createPost);
router.put("/updatepost/:id",protectRoute,updatePost);
router.delete("/deletepost/:id",protectRoute,deletePost);
router.get("/getallposts",getAllPosts)
router.get("/getpostbyid/:id",getPostById);
router.get("/getpostbycategory/:category",getPostByCategory);
router.get("/getpostbyuser/:id",getPostByUser);

module.exports = router;