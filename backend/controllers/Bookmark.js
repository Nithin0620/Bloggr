const Bookmark = require("../modals/bookmark");

exports.toggleBookmark = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const postId = req.params.id;

    const existing = await Bookmark.findOne({ user: userId, post: postId });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    }

    await Bookmark.create({ user: userId, post: postId });
    return res.status(200).json({
      success: true,
      bookmarked: true,
      message: "Post bookmarked",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error toggling bookmark",
    });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const userId = req.user.user._id;

    const bookmarks = await Bookmark.find({ user: userId })
      .populate({
        path: "post",
        populate: [
          { path: "author", select: "firstName lastName profilePic" },
          { path: "categories", select: "name" },
          { path: "likes", select: "firstName lastName" },
          {
            path: "comments",
            populate: { path: "user", select: "firstName lastName" },
          },
        ],
      })
      .sort({ createdAt: -1 });

    const posts = bookmarks.map((b) => b.post).filter(Boolean);

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookmarks",
    });
  }
};

exports.getBookmarkedPostIds = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const bookmarks = await Bookmark.find({ user: userId }).select("post");
    const postIds = bookmarks.map((b) => b.post.toString());

    return res.status(200).json({
      success: true,
      data: postIds,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookmarked post IDs",
    });
  }
};
