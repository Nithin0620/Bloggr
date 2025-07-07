const User = require("../modals/user");
const Post = require("../modals/post");

export const likeUnlikeAPost = async (req, res) => {
  try {
      const userId = req.user._id;
      const postId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      const post = await Post.findById(postId);
      if (!post) {
         return res.status(404).json({ success: false, message: "Post not found" });
      }

      let action = "";

      if (post.likes.includes(userId)) {

         post.likes.pull(userId);
         action = "unliked";
      } else {

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