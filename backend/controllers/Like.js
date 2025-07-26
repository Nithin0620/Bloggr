const User = require("../modals/user");
const Post = require("../modals/post");
const Notification = require("../modals/notification")
const {io,getReceiverSocketId} = require("../configuration/socket")
const Settings = require("../modals/settings")
const {notificationMailTemplate} = require("../tamplets/EmailNotificationTamplet");
const {sendEmail} = require("../utility/mailSender.js")

// const {io} = require("socket.io")
exports.likeUnlikeAPost = async (req, res) => {
  try {
      const userId = req.user.user._id;
      const postId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(401).json({ success: false, message: "User not found" });
      }

      const post = await Post.findById(postId).populate("author").exec();
      if (!post) {
         return res.status(402).json({ success: false, message: "Post not found" });
      }

      let action = "";

      
      if (post.likes.includes(userId)) {
         
         post.likes.pull(userId);
         action = "unliked";
      } else {
         const responseNotification = await Notification.create({
            sender: userId,
            type: "like",
            post: postId,
            receiver: post.author._id
         });

         const settings = await Settings.findOne({ user: post.author._id });

         if (settings?.emailNotification === true && responseNotification) {
            try {
              setImmediate(async()=>{
                await sendEmail(
                  post.author.email,  
                  "Someone liked your post!",
                  notificationMailTemplate({
                  username: post.author.firstName,        
                  actionType: "like",                     
                  actorName: user.firstName,              
                  postTitle: post.title,
                  link:`   /readmore/${postId}`
                  })
               );
              })
            } catch (e) {
               console.log("Error sending notification email:", e);
            }
         }

         if(responseNotification && settings.pushNotification === true){
            const receiverSocketId = getReceiverSocketId(post.author._id);
            if (receiverSocketId) {
               io.to(receiverSocketId).emit("newNotification", { responseNotification, user });
            }
         }
         
         post.likes.push(userId);
         action = "liked";
      }

      await post.save();

      return res.status(200).json({
         success: true,
         message: `Post successfully ${action}`,
         likesCount: post.likes.length,
      });

   } 
   catch (e) {
      console.error(e);
      return res.status(500).json({
         success: false,
         message: "Error occurred in like/unlike post controller",
      });
   }
};

exports.haveCurrentUserLiked = async(req,res)=>{
   try{
      const userId = req.user.user._id;
      const postId = req.params.id;

      const post = await Post.findById(postId);

      if(!post) return res.status(400).json({success:false,message:"Post not found with this id"});

      const likes = post.likes;

      if(likes.includes(userId)) return res.status(200).json({success:true,message:"Yes the user have liked this post",data:true});
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"Error occured in isCurrentUserLiked controller"});
   }
}


exports.getAllLikedPostsByCurrentUser = async (req, res) => {
   try {
      const userId = req.user.user._id;

      const likedPosts = await Post.find({ likes: userId }).select("_id"); 

      return res.status(200).json({
         success: true,
         message: "Fetched all liked posts by the user",
         data: likedPosts,
      });
   } catch (error) {
      console.error("Error fetching liked posts:", error);
      return res.status(500).json({
         success: false,
         message: "Internal server error while fetching liked posts",
      });
   }
};
