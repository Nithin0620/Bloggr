const Tag = require("../modals/tag");
const Post = require("../modals/post");
const { flushCache } = require("../middlewares/cache");

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Tag name is required" });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const existing = await Tag.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Tag already exists" });
    }

    const tag = await Tag.create({ name: name.toLowerCase().trim(), slug });

    flushCache("tags").catch(() => {});

    return res.status(201).json({
      success: true,
      message: "Tag created",
      data: tag,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Error creating tag" });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ postCount: -1 });
    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Error fetching tags" });
  }
};

exports.getPostsByTag = async (req, res) => {
  try {
    const { tagId } = req.params;

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    const posts = await Post.find({ tags: tagId, $or: [
      { status: "published" },
      { status: "scheduled", scheduledAt: { $lte: new Date() } },
    ] })
      .populate("author", "firstName lastName profilePic")
      .populate("categories", "name")
      .populate("tags", "name slug")
      .populate("likes", "firstName lastName")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstName lastName image" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { tag, posts },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Error fetching posts by tag" });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    // Remove tag from all posts
    await Post.updateMany({ tags: id }, { $pull: { tags: id } });

    flushCache("tags").catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Tag deleted",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Error deleting tag" });
  }
};
