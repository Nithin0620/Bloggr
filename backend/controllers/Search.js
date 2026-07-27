const Post = require("../models/post");
const { generateEmbedding } = require("../services/embedder");
const { searchSimilarChunks } = require("../services/vectorStore");

exports.semanticSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query string 'q' is required",
      });
    }

    // 1. Generate embedding for user query
    const queryVector = await generateEmbedding(q.trim());

    // 2. Search Qdrant for top 20 similar vector chunks
    const matches = await searchSimilarChunks(queryVector, 25);

    if (!matches || matches.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // 3. Deduplicate by articleId (keep highest scoring chunk)
    const articleScoreMap = new Map();
    for (const match of matches) {
      const payload = match.payload;
      if (!payload || !payload.articleId) continue;

      const existing = articleScoreMap.get(payload.articleId);
      if (!existing || match.score > existing.score) {
        articleScoreMap.set(payload.articleId, {
          score: match.score,
          matchedSnippet: payload.chunkText,
        });
      }
    }

    const articleIds = Array.from(articleScoreMap.keys());

    // 4. Fetch Post documents from MongoDB
    const posts = await Post.find({
      _id: { $in: articleIds },
      status: "published",
    })
      .populate("author", "name avatar profile")
      .populate("categories", "name")
      .populate("tags", "name slug");

    // 5. Combine and sort by score descending
    const results = posts
      .map((post) => {
        const info = articleScoreMap.get(post._id.toString()) || {};
        return {
          post,
          score: info.score ? Math.round(info.score * 100) : 0,
          matchedSnippet: info.matchedSnippet || "",
        };
      })
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error in semantic search:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to perform semantic search",
    });
  }
};
