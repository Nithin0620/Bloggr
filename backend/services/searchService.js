const Post = require("../models/post");
const { generateEmbedding } = require("./embedder");
const { searchSimilarChunks } = require("./vectorStore");

async function semanticSearch(query, limit = 25) {
  const queryVector = await generateEmbedding(query);

  const matches = await searchSimilarChunks(queryVector, limit);

  if (!matches || matches.length === 0) {
    return [];
  }

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

  const posts = await Post.find({
    _id: { $in: articleIds },
    status: "published",
  })
    .populate("author", "name avatar profile")
    .populate("categories", "name")
    .populate("tags", "name slug");

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

  return results;
}

module.exports = { semanticSearch };
