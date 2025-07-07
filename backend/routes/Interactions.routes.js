const express = require("express")
const router = express.Router();
const {protectRoutes} = require("../middlewares/auth.middleware")

const { 
   addComment,
   deleteComment,
   getComments
} = require("../controllers/Comment")

const {
   likeUnlikeAPost
} = require("../controllers/Like")

const {
   createNotification,
   getAllNotification,
   markAllAsRead,
   deleteaNotification,
   setNotificationAsRead
} = require("../controllers/Notification")



//Comment;
router.post("/addcomment/:id",protectRoutes,addComment);
router.delete("/deletecomment/:id",protectRoutes,deleteComment);
router.get("/getcomments/:id",getComments)

//Like
router.put("/like-unlikepost/:id",protectRoutes,likeUnlikeAPost);

//Notification
router.post("/createnotification/:id",protectRoutes,createNotification)
router.get("/getallnotification",protectRoutes,getAllNotification);
router.put("/markallasread",protectRoutes,markAllAsRead);
router.delete("/deletenotification/:id",protectRoutes,deleteaNotification);
router.put("/setnotificationasread/:id",protectRoutes,setNotificationAsRead);


module.exports = router;