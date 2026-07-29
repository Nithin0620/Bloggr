const Post = require("../models/post");
const { generatePodcast } = require("../services/podcastGenerator");
const logger = require("../configuration/logger");

exports.generatePodcast = async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({ success: false, message: "articleId is required" });
    }

    const post = await Post.findById(articleId).select("title content summary podcast");
    if (!post) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (post.podcast?.status === "completed" && post.podcast?.script?.length > 0) {
      return res.status(200).json({
        success: true,
        podcast: {
          title: `Podcast: ${post.title}`,
          script: post.podcast.script,
          duration: post.podcast.duration,
        },
      });
    }

    await Post.findByIdAndUpdate(articleId, { "podcast.status": "processing" });

    const result = await generatePodcast({
      title: post.title,
      content: post.content,
      summary: post.summary,
    });

    await Post.findByIdAndUpdate(articleId, {
      "podcast.status": "completed",
      "podcast.script": result.script,
      "podcast.audioUrl": result.audioUrl,
      "podcast.duration": result.duration,
    });

    return res.status(200).json({
      success: true,
      podcast: {
        title: `Podcast: ${post.title}`,
        script: result.script,
        duration: result.duration,
      },
    });
  } catch (error) {
    logger.error(`Podcast generate error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Failed to generate podcast" });
  }
};

exports.getPodcastStatus = async (req, res) => {
  try {
    const { articleId } = req.params;
    const post = await Post.findById(articleId).select("podcast title");
    if (!post) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }
    return res.status(200).json({
      success: true,
      status: post.podcast?.status || "pending",
    });
  } catch (error) {
    logger.error(`Podcast status error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Failed to get podcast status" });
  }
};

exports.getPodcast = async (req, res) => {
  try {
    const { articleId } = req.params;
    const post = await Post.findById(articleId).select("podcast title");
    if (!post) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (post.podcast?.status !== "completed") {
      return res.status(200).json({
        success: true,
        status: post.podcast?.status || "pending",
        podcast: null,
      });
    }

    return res.status(200).json({
      success: true,
      status: "completed",
      podcast: {
        title: `Podcast: ${post.title}`,
        script: post.podcast.script,
        audioUrl: post.podcast.audioUrl,
        duration: post.podcast.duration,
      },
    });
  } catch (error) {
    logger.error(`Get podcast error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Failed to get podcast" });
  }
};
