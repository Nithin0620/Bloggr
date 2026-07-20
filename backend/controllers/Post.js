const User = require("../modals/user");
const Post = require("../modals/post");
const Profile = require("../modals/profile")
const Category = require("../modals/category");
const Tag = require("../modals/tag");
const {cloudinaryInstance } = require("../configuration/cloudinary");
const { flushCache } = require("../middlewares/cache");


exports.createPost = async (req, res) => {
  try {
    const author = req.user.user._id;
    const { title, content, readTime, scheduledAt } = req.body;
    const categories = req.body.categories;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required 2",
      });
    }

    const imagePath = req.file.path;

    if (!title || !content || !categories || !readTime) {
      return res.status(400).json({
        success: false,
        message: "All the Fields are required 1",
      });
    }

    const checkUserPresent = await User.findById(author);
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User not found or user not registered",
      });
    }

    const categoryDocs = await Category.find({ name: { $in: categories } });
    const categoryIds = categoryDocs.map(cat => cat._id);

    // Handle tags
    let tagIds = [];
    const tagNames = req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [];
    if (tagNames.length > 0) {
      const tagDocs = await Promise.all(
        tagNames.map(async (tagName) => {
          const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          let tag = await Tag.findOne({ slug });
          if (!tag) {
            tag = await Tag.create({ name: tagName.toLowerCase().trim(), slug });
          }
          await Tag.findByIdAndUpdate(tag._id, { $inc: { postCount: 1 } });
          return tag._id;
        })
      );
      tagIds = tagDocs;
    }

    var imageUpload;

    if(imagePath){
      imageUpload = await cloudinaryInstance .uploader.upload(imagePath);
    }  

    const isScheduled = scheduledAt && new Date(scheduledAt) > new Date();

    const payload = {
      author: author,
      title: title,
      content: content,
      readTime: readTime,
      categories: categoryIds,
      tags: tagIds,
      image:imageUpload ? imageUpload.secure_url : undefined,
      status: isScheduled ? "scheduled" : "published",
      scheduledAt: isScheduled ? new Date(scheduledAt) : null,
    };

    const response = await Post.create(payload);

    // Add post to each category's posts array
    await Promise.all(
      categoryIds.map(async (categoryId) => {
        await Category.findByIdAndUpdate(categoryId, {
          $push: { posts: response._id },
        });
      })
    );

    const user = await User.findById(author);

    await Profile.findByIdAndUpdate(user.profile,{
      $push:{posts: response._id},
    })

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Error in creating the post on db",
      });
    }

    flushCache("posts").catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Post created Successfully",
      data: response,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error in creating the post on db",
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const author = req.user.user._id;
    const { title, content, readTime } = req.body;
    const categories = req.body.categories;
    const postId = req.params.id;

    if (!title || !content || !categories || !readTime) {
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
      return res.status(404).json({
        success: false,
        message: "No post found",
      });
    }

    const categoryDocs = await Category.find({ name: { $in: categories } });
    const categoryIds = categoryDocs.map(cat => cat._id);

    // Handle tags - decrement old tags, increment new ones
    const oldTagIds = post.tags || [];
    let tagIds = [];
    const tagNames = req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [];
    if (tagNames.length > 0) {
      const tagDocs = await Promise.all(
        tagNames.map(async (tagName) => {
          const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          let tag = await Tag.findOne({ slug });
          if (!tag) {
            tag = await Tag.create({ name: tagName.toLowerCase().trim(), slug });
          }
          if (!oldTagIds.includes(tag._id.toString())) {
            await Tag.findByIdAndUpdate(tag._id, { $inc: { postCount: 1 } });
          }
          return tag._id;
        })
      );
      tagIds = tagDocs;
    }

    // Decrement removed tags
    for (const oldTagId of oldTagIds) {
      if (!tagIds.includes(oldTagId)) {
        await Tag.findByIdAndUpdate(oldTagId, { $inc: { postCount: -1 } });
      }
    }

    // OPTIONAL: Remove post ID from old categories if categories changed
    await Category.updateMany(
      { _id: { $in: post.categories } },
      { $pull: { posts: post._id } }
    );

    await Category.updateMany(
      { _id: { $in: categoryIds } },
      { $addToSet: { posts: post._id } }
    );

    // Handle optional image update
    let imageUpload;
    if (req.file && req.file.path) {
      imageUpload = await cloudinaryInstance.uploader.upload(req.file.path);
    }

    // Prepare updated payload
    const updatedPayload = {
      title,
      content,
      readTime,
      categories: categoryIds,
      tags: tagIds,
      image: imageUpload ? imageUpload.secure_url : post.image,
    };

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedPayload, {
      new: true,
    });

    flushCache("posts").catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error updating the post in the database",
    });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const postId  = req.params.id;
    const userId = req.user.user._id;

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

    flushCache("posts").catch(() => {});

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

exports.getAllPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const cursor = req.query.cursor;

    const query = {
      $or: [
        { status: { $ne: "scheduled" } },
        { status: "scheduled", scheduledAt: { $lte: new Date() } },
      ]
    };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const response = await Post.find(query)
      .populate("author", "firstName lastName image profilePic")
      .populate("categories", "name")
      .populate("tags", "name slug")
      .populate("likes", "firstName lastName createdAt")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstName lastName image" },
      })
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .exec();

    const hasMore = response.length > limit;
    const posts = hasMore ? response.slice(0, limit) : response;
    const nextCursor = hasMore ? posts[posts.length - 1].createdAt : null;

    return res.status(200).json({
      success: true,
      message: "All posts fetched successfully",
      data: posts,
      nextCursor,
      hasMore,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "error in fetching all the posts",
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const response = await Post.findById(postId)
      .populate("author", "firstName lastName image")
      .populate("categories", "name")
      .populate("tags", "name slug")
      .populate("likes", "firstName lastName")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstName lastName image" },
      })
      .sort({createdAt:-1})
      .exec();

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Count unique view per logged-in user
    const viewerId = req.user?.user?._id;
    if (viewerId) {
      if (!response.viewedBy.some(id => id.toString() === viewerId.toString())) {
        await Post.findByIdAndUpdate(postId, {
          $inc: { views: 1 },
          $addToSet: { viewedBy: viewerId },
        });
        response.views += 1;
      }
    }

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

exports.getPostByCategory = async (req, res) => {
  try {
      const categoryName = req.params.category;

      const category = await Category.findOne({ name: categoryName }).populate({
         path: "posts",
         options: { sort: { createdAt: -1 } },
         populate: [
            { path: "author", select: "firstName lastName image" },
            { path: "categories", select: "name" },
            { path: "tags", select: "name slug" },
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

exports.getScheduledPosts = async (req, res) => {
  try {
    const userId = req.user.user._id;

    const response = await Post.find({
      author: userId,
      status: "scheduled",
      scheduledAt: { $gt: new Date() },
    })
      .populate("author", "firstName lastName image profilePic")
      .populate("categories", "name")
      .populate("tags", "name slug")
      .sort({ scheduledAt: 1 })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Scheduled posts fetched successfully",
      data: response,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error fetching scheduled posts",
    });
  }
};

exports.getPostByUser = async(req,res)=>{
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
            { path: "tags", select: "name slug" },
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
         data: response,
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