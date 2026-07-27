const Post = require("../models/post");
const { stripHtml } = require("./chunker");
const { generateEmbedding } = require("./embedder");
const { searchSimilarChunks } = require("./vectorStore");

/**
 * Retrieves vector-similarity-based related articles for a given article ID.
 * Falls back to category/tag overlap if vector store yields no results.
 */
async function getVectorRelatedPosts(postId, limit = 5) {
  try {
    const post = await Post.findById(postId).select("title content categories tags");
    if (!post) return [];

    // 1. Generate query embedding for current post
    const textToEmbed = `${post.title}. ${stripHtml(post.content).substring(0, 500)}`;
    const queryVector = await generateEmbedding(textToEmbed);

    // 2. Search Qdrant for top similar chunks
    const matches = await searchSimilarChunks(queryVector, 20);

    if (matches && matches.length > 0) {
      // 3. Exclude current article and deduplicate by articleId
      const relatedMap = new Map();
      for (const match of matches) {
        const payload = match.payload;
        if (!payload || !payload.articleId || payload.articleId === postId.toString()) continue;

        if (!relatedMap.has(payload.articleId)) {
          relatedMap.set(payload.articleId, match.score);
        }
      }

      const candidateIds = Array.from(relatedMap.keys()).slice(0, limit);

      if (candidateIds.length > 0) {
        const relatedPosts = await Post.find({
          _id: { $in: candidateIds },
          status: "published",
        })
          .populate("author", "firstName lastName avatar profile")
          .populate("categories", "name")
          .populate("tags", "name slug");

        // Maintain score sorting
        return relatedPosts.sort((a, b) => {
          const scoreA = relatedMap.get(a._id.toString()) || 0;
          const scoreB = relatedMap.get(b._id.toString()) || 0;
          return scoreB - scoreA;
        });
      }
    }

    return null; // Signals fallback to category/tag overlap
  } catch (error) {
    console.error("Vector recommendation error:", error.message);
    return null;
  }
}

module.exports = {
  getVectorRelatedPosts,
};
