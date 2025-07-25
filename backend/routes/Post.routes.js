const express = require("express")
const router  = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const upload = require("../middlewares/multer")

const {
   createPost,
   updatePost,
   deletePost,
   getAllPosts,
   getPostById,
   getPostByCategory,
   getPostByUser
} = require("../controllers/Post")

router.post("/createpost",protectRoute,upload.single("image"),createPost);
router.put("/updatepost/:id",protectRoute,upload.single("image"),updatePost);
router.delete("/deletepost/:id",protectRoute,deletePost);
router.get("/getallposts",getAllPosts)
router.get("/getpostbyid/:id",getPostById);
router.get("/getpostbycategory/:category",getPostByCategory);
router.get("/getpostbyuser/:id",getPostByUser);

module.exports = router;