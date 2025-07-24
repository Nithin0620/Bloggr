const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")

const { 
   addComment,
   deleteComment,
   getComments
} = require("../controllers/Comment")

const {
   likeUnlikeAPost,
   haveCurrentUserLiked,
   getAllLikedPostsByCurrentUser
} = require("../controllers/Like")

const {
   createNotification,
   getAllNotification,
   markAllAsRead,
   deleteaNotification,
   setNotificationAsRead
} = require("../controllers/Notification")



//Comment;
router.post("/addcomment/:id",protectRoute,addComment);
router.delete("/deletecomment/:postid/:commentid",protectRoute,deleteComment);
router.get("/getcomments/:id",getComments)

//Like
router.put("/like-unlikepost/:id",protectRoute,likeUnlikeAPost);
router.get("/havecurruserliked/:id",protectRoute,haveCurrentUserLiked);
router.get("/getalllikedpostbycurrentuser",protectRoute,getAllLikedPostsByCurrentUser);

//Notification
router.post("/createnotification/:id",protectRoute,createNotification)
router.get("/getallnotification",protectRoute,getAllNotification);
router.put("/markallasread",protectRoute,markAllAsRead);
router.delete("/deletenotification/:id",protectRoute,deleteaNotification);
router.put("/setnotificationasread/:id",protectRoute,setNotificationAsRead);


module.exports = router;