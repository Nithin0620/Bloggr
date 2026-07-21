const User = require("../models/user")
const Post = require("../models/post")
const Comment = require("../models/comment")
const Notification = require("../models/notification")
const {io,getReceiverSocketId} = require("../configuration/socket")
const {notificationMailTemplate} = require("../templates/EmailNotificationTamplet");
const {sendEmail} = require("../utility/mailSender.js")
const Settings = require("../models/settings.js")
const logger = require("../configuration/logger");

exports.addComment = async (req, res) => {
   try {
      const userId = req.user.user._id;
      const postId = req.params.id;
      const commentText = req.body.comment || req.body.text;

      if (!commentText)
         return res.status(400).json({
         success: false,
         message: "Comment data is required",
         });

      const user = await User.findById(userId);
      if (!user)
         return res.status(404).json({
         success: false,
         message: "User not found",
         });

      const post = await Post.findById(postId).populate("author").exec();
      if (!post)
         return res.status(404).json({
         success: false,
         message: "Post not found",
         });

      const newComment = await Comment.create({
         post: postId,
         user: userId,
         text: commentText,
      });

      const responseNotification = await Notification.create({
         sender: userId,
         type: "comment",
         post: postId,
         receiver: post.author._id,
      });

      const settings = await Settings.findOne({ user: post.author._id });

      if (settings?.emailNotification === true && responseNotification) {
         try {
            setImmediate(async()=>{
               await sendEmail(
                  post.author.email,
                  "Someone commented on your post!",
                  notificationMailTemplate({
                     username: post.author.firstName, 
                     actionType: "comment",
                     actorName: user.firstName,     
                     postTitle: post.title,
                     commentContent: commentText,   
                     link:`   https://bloggr-y7gx.onrender.com/readmore/${postId}`
         
                  })
               );
            })
         } catch (e) {
         logger.error("Error sending notification email:", e);
         }
      }

      if (responseNotification && settings?.pushNotification === true) {
         const receiverSocketId = getReceiverSocketId(post.author._id);
         if (receiverSocketId) {
         io.to(receiverSocketId).emit("newNotification", {
            responseNotification,
            user,
         });
         }
      }

      if (!newComment)
         return res.status(403).json({
         success: false,
         message: "Failed to create new comment",
         });

      await Post.findByIdAndUpdate(postId, {
         $push: { comments: newComment._id },
      });

      return res.status(200).json({
         success: true,
         message: "Comment added successfully",
         data: newComment,
      });
   } catch (e) {
      logger.error(e);
      return res.status(500).json({
         success: false,
         message: "Error occurred while creating comment",
      });
   }
};


exports.deleteComment = async(req,res)=>{
   try{
      const userId = req.user.user._id;
      const postId = req.params.postid;

      // console.log("post id ", postId);
      // console.log("user id currently",userId)

      const user= await User.findById(userId);
      if(!user) return res.status(401).json({success:false,message:"user not found"})

      const post = await Post.findById(postId);
      if(!post) return res.status(402).json({success:false,message:"Post not found"})

      const commentId = req.params.commentid;
      // console.log("Comment id",commentId)
      
      const comment = await Comment.findById(commentId);

      if (!comment) {
         return res.status(404).json({
            success: false,
            message: "Comment not found"
         });
      }

      // console.log("user who made this post",comment)

      if(comment.user.toString() !== userId.toString()) return res.status(401).json({success:false,message:"this user is not authorized to delete this comment"})
      
      const updatedPost = await Post.findByIdAndUpdate(postId,{
         $pull:{comments:commentId},
      })

      await Comment.findByIdAndDelete(commentId);

      return res.status(200).json({
         success:true,
         message:"Comment deleted from the post successfully",
         data:updatedPost
      })
   }  
   catch(e){
      logger.error(e)
      return res.status(500).json({
         success:false,
         message:"Error occured in deleting the comment from the post"
      })
   }
}

exports.getComments = async(req,res)=>{
   try{
      const postId = req.params.id;

      const post = await Post.findById(postId).populate({path:"comments",options:{sort:{createdAt:-1}} , populate:{path:"user",select:"firstName lastName profilePic profile"}});

      if(!post) return res.status(404).json({
         success:false,
         message:"post not found"
      })

      const commentsList = post?.comments || [] ;

      return res.status(200).json({success:true,message:"post Comments retrived successfully" , data:commentsList});
      
   }
   catch(e){
      logger.error(e)
      return res.status(500).json({success:false,message:"error occured in retriving the comments from the posts"});
   }
}