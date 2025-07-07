const User = require("../modals/user");
const Post = require("../modals/post");
const Profile = require("../modals/profile")
const Category = require("../modals/category");
const cloudinary = require("../configuration/cloudinary");

export const createPost = async (req, res) => {
  try {
    const { author } = req.user._id;
    const { title, content, categories, image, readTime } = req.body;

    if (!title || !content || !categories || !image || !readTime) {
      return res.status(400).json({
        success: false,
        message: "All the Fields are required",
      });
    }

    const checkUserPresent = await User.findById(author);
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User not found or user not registered",
      });
    }

    const imageUpload = await cloudinary.uploader.upload(image);

    const payload = {
      author: author,
      title: title,
      content: content,
      readTime: readTime,
      categories: categories,
      image: imageUpload.secure_url,
    };

    const response = await Post.create(payload);

    await Promise.all(
      categories.map(async (categoryId) => {
        await Category.findByIdAndUpdate(categoryId, {
          $push: { posts: response._id },
        });
      })
    );

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Error in creating the post on db",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post created Successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error in creating the post on db",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const author = req.user._id;
    const { title, content, categories, image, readTime } = req.body;
    const postId = req.params.id;

    if (!title || !content || !categories || !image || !readTime) {
      return res.status(400).json({
        success: false,
        message: "All the Fields are required",
      });
    }

    const checkUserPresent = await User.findById(author);
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User not found or user not registered",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(402).json({
        success: false,
        message: "No post found",
      });
    }

    const imageUpload = await cloudinary.uploader.upload(image);

    const payload = {
      author: author,
      title: title,
      content: content,
      readTime: readTime,
      categories: categories,
      image: imageUpload.secure_url,
    };

    const response = await Post.findByIdAndUpdate(postId, payload, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Post created Successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error in creating the post on db",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params.id;
    const userId = req.user._id;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "postId not available or unable to fetch",
      });
    }

    const user = await User.findById(userId).populate("profile");
    const profileId = user.profile._id;

    const newProfile = await Profile.findByIdAndUpdate(profileId, {
      $pull: { posts: postId },
    });

    const post = await Post.findById(postId);
    const categories = post.categories;

    await Promise.all(
      categories.map(async (categoryId) => {
        await Category.findByIdAndUpdate(categoryId, {
          $pull: { posts: postId },
        });
      })
    );

    const response = await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post Deleted successfully",
      data: response,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "error in deleting the post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const response = await Post.find()
      .populate("author", "firstName lastName image")
      .populate("categories", "name")
      .populate("likes", "firstName lastName createdAt")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstName lastName image" },
      })
      .exec();

    const finalResponse = response.sort({ createdAt: -1 }); //jo naya, vo  pehle ayega

    return res.status(200).json({
      success: true,
      message: "All posts fetched successfully",
      data: finalResponse,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "error in fetching all the posts",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const response = await Post.findById(postId)
      .populate("author", "firstName lastName image")
      .populate("categories", "name")
      .populate("likes", "firstName lastName")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstName lastName image" },
      })
      .sort({createdAt:-1})
      .exec();

    return res.status(200).json({
      success: true,
      message: " posts fetched by Id successfully",
      data: response,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "error in fetching all the posts",
    });
  }
};

export const getPostByCategory = async (req, res) => {
  try {
      const categoryName = req.params.category;

      const category = await Category.findOne({ name: categoryName }).populate({
         path: "posts",
         options: { sort: { createdAt: -1 } },
         populate: [
            { path: "author", select: "firstName lastName image" },
            { path: "categories", select: "name" },
            { path: "likes", select: "firstName lastName" },
            {
               path: "comments",
               populate: { path: "user", select: "firstName lastName image" },
            },
         ],
      });

      if (!category) {
         return res.status(404).json({
         success: false,
         message: "Category not found",
         });
      }

      return res.status(200).json({
         success: true,
         message: "Posts fetched by category successfully",
         data: category,
      });
   }
   catch (e) {
      console.log(e);
      return res.status(500).json({
         success: false,
         message: "Error in fetching the posts by category",
      });
   }
};

export const getPostByUser = async(req,res)=>{
   try{
      const userId = req.params.id;

      const user = await User.findById(userId);

      if(!user){
         return res.status(404).json({
            success:false,
            message:"User not found",
         })
      }

      const profileId = user.profile;

      const response = await Profile.findById(profileId).populate({
         path: "posts",
         options: { sort: { createdAt: -1 } },
         populate: [
            { path: "author", select: "firstName lastName image" },
            { path: "categories", select: "name" },
            { path: "likes", select: "firstName lastName" },
            {
               path: "comments",
               populate: { path: "user", select: "firstName lastName image" },
            },
         ],
      })
      return res.status(200).json({
         success: true,
         message: "Posts fetched by User Id successfully",
         data: response.posts,
      });
   }
   catch (e) {
      console.log(e);
      return res.status(500).json({
         success: false,
         message: "Error in fetching the posts by User Id",
      });
   }
};