const express = require("express")
const router = express.Router();
const {protectRoute} = require("../middlewares/auth.middleware")
const { writeLimiter, generalLimiter } = require("../middlewares/rateLimiter")
const {
  addCommentValidation,
  deleteCommentValidation,
  mongoIdParamValidation,
} = require("../middlewares/validate")

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
   setNotificationAsRead,
   clearAllNotification
} = require("../controllers/Notification")

//Comment
router.post("/addcomment/:id", protectRoute, writeLimiter, addCommentValidation, addComment);
router.delete("/deletecomment/:postid/:commentid", protectRoute, writeLimiter, deleteCommentValidation, deleteComment);
router.get("/getcomments/:id", generalLimiter, mongoIdParamValidation("id"), getComments)

//Like
router.put("/like-unlikepost/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), likeUnlikeAPost);
router.get("/havecurruserliked/:id", protectRoute, generalLimiter, mongoIdParamValidation("id"), haveCurrentUserLiked);
router.get("/getalllikedpostbycurrentuser", protectRoute, generalLimiter, getAllLikedPostsByCurrentUser);

//Notification
router.post("/createnotification/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), createNotification)
router.get("/getallnotification", protectRoute, generalLimiter, getAllNotification);
router.put("/markallasread", protectRoute, writeLimiter, markAllAsRead);
router.delete("/deletenotification/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), deleteaNotification);
router.delete("/clearallnotification", protectRoute, writeLimiter, clearAllNotification);
router.put("/setnotificationasread/:id", protectRoute, writeLimiter, mongoIdParamValidation("id"), setNotificationAsRead);

module.exports = router;
