const User = require("../modals/user")
const Post = require("../modals/post")
const Comment = require("../modals/comment")



export const addComment = async(req,res)=>{
   try{
      const userId = req.user.id;
      const postId = req.params.id;

      const {comment} = req.body;

      const user= await User.findById(userId);
      if(!user) return res.status(404).json({success:false,message:"user not found"})

      const post = await Post.findById(postId);
      if(!post) return res.status(404).json({success:false,message:"Post not found"})

      const newComment = await Comment.create({userId , postId , comment});

      if(!newComment) return res.status(403).json({success:false,message:"failed to create new Comment"})

      await Post.findByIdAndUpdate(postId,{
         $push:{comments:newComment._id},
      })

      return res.status(200).json({
         success:true,
         message:"Comment created and added in the respective post successfully",
         data:newComment
      })
   }  
   catch(e){
      console.log(e)
      return res.status(500).json({
         success:false,
         message:"Error occured in creating and adding new comment into the post"
      })
   }
}

export const deleteComment = async(req,res)=>{
   try{
      const userId = req.user.id;
      const postId = req.params.id;

      const user= await User.findById(userId);
      if(!user) return res.status(404).json({success:false,message:"user not found"})

      const post = await Post.findById(postId);
      if(!post) return res.status(404).json({success:false,message:"Post not found"})

      const commentId = req.body;

      const comment = await Comment.findById(commentId);

      if(comment.user !== userId) return res.status(401).json({success:false,message:"this user is not authorized to delete this comment"})
      
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
      console.log(e)
      return res.status(500).json({
         success:false,
         message:"Error occured in deleting the comment from the post"
      })
   }
}

export const getComments = async(req,res)=>{
   try{
      const postId = req.params.id;

      const post = await Post.findById(postId).populate({path:"comments",options:{sort:{createdAt:-1}} , populate:"user"});

      if(!post) return res.status(404).json({
         success:false,
         message:"post not found"
      })

      const commentsList = post?.comments || [] ;

      return res.status(200).json({success:true,message:"post Comments retrived successfully" , data:commentsList});
      
   }
   catch(e){
      console.log(e)
      return res.status(500).json({success:false,message:"error occured in retriving the comments from the posts"});
   }
}