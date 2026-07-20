const ReadingList = require("../models/readingList");
const logger = require("../configuration/logger");

exports.createReadingList = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const list = await ReadingList.create({
      user: userId,
      name,
      description: description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Reading list created",
      data: list,
    });
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ success: false, message: "Error creating reading list" });
  }
};

exports.getMyReadingLists = async (req, res) => {
  try {
    const userId = req.user.user._id;

    const lists = await ReadingList.find({ user: userId })
      .populate({
        path: "posts",
        select: "title image author createdAt",
        populate: { path: "author", select: "firstName lastName" },
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ success: false, message: "Error fetching reading lists" });
  }
};

exports.getReadingListById = async (req, res) => {
  try {
    const { id } = req.params;

    const list = await ReadingList.findById(id)
      .populate({
        path: "posts",
        populate: [
          { path: "author", select: "firstName lastName profilePic" },
          { path: "categories", select: "name" },
          { path: "tags", select: "name slug" },
          { path: "likes", select: "firstName lastName" },
          {
            path: "comments",
            populate: { path: "user", select: "firstName lastName image" },
          },
        ],
      });

    if (!list) {
      return res.status(404).json({ success: false, message: "Reading list not found" });
    }

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ success: false, message: "Error fetching reading list" });
  }
};

exports.updateReadingList = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { id } = req.params;
    const { name, description } = req.body;

    const list = await ReadingList.findOne({ _id: id, user: userId });
    if (!list) {
      return res.status(404).json({ success: false, message: "Reading list not found" });
    }

    if (name) list.name = name;
    if (description !== undefined) list.description = description;
    await list.save();

    return res.status(200).json({
      success: true,
      message: "Reading list updated",
      data: list,
    });
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ success: false, message: "Error updating reading list" });
  }
};

exports.deleteReadingList = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { id } = req.params;

    const list = await ReadingList.findOneAndDelete({ _id: id, user: userId });
    if (!list) {
      return res.status(404).json({ success: false, message: "Reading list not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reading list deleted",
    });
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ success: false, message: "Error deleting reading list" });
  }
};

exports.addPostToList = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { listId, postId } = req.params;

    const list = await ReadingList.findOne({ _id: listId, user: userId });
    if (!list) {
      return res.status(404).json({ success: false, message: "Reading list not found" });
    }

    if (list.posts.includes(postId)) {
      return res.status(400).json({ success: false, message: "Post already in this list" });
    }

    list.posts.push(postId);
    await list.save();

    return res.status(200).json({
      success: true,
      message: "Post added to reading list",
      data: list,
    });
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ success: false, message: "Error adding post to list" });
  }
};

exports.removePostFromList = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { listId, postId } = req.params;

    const list = await ReadingList.findOne({ _id: listId, user: userId });
    if (!list) {
      return res.status(404).json({ success: false, message: "Reading list not found" });
    }

    list.posts = list.posts.filter((id) => id.toString() !== postId);
    await list.save();

    return res.status(200).json({
      success: true,
      message: "Post removed from reading list",
      data: list,
    });
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ success: false, message: "Error removing post from list" });
  }
};
