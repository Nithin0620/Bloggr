const Post = require("../models/post");

/**
 * Calculates a multi-signal TrendingScore for a post.
 * 
 * Formula:
 * TrendingScore = 
 *   0.35 * Engagement (likes, bookmarks, comments)
 * + 0.20 * ReadCompletionRate (estimated from views & engagement)
 * + 0.20 * GrowthRate (engagement in last 24 hours)
 * + 0.15 * SentimentScore (comment sentiment ratio)
 * + 0.10 * Freshness (time decay)
 */
function calculateTrendingScore(post) {
  if (!post) return 0;

  const likes = Array.isArray(post.likes) ? post.likes.length : 0;
  const comments = Array.isArray(post.comments) ? post.comments.length : 0;
  const views = post.views || 0;
  const sentimentScore = post.sentimentScore || 0; // -1 to +1 or 0-100

  // 1. Engagement Score (weighted likes, comments)
  const engagementRaw = likes * 2 + comments * 4;
  const engagementScore = Math.min(100, engagementRaw * 2);

  // 2. Read Completion / Depth Rate (estimated ratio of active engagement to total views)
  const activeReaders = likes + comments;
  const completionRatio = views > 0 ? Math.min(1, activeReaders / Math.max(10, views * 0.2)) : 0;
  const readCompletionScore = completionRatio * 100;

  // 3. Growth Rate / Velocity (recent creation bonus)
  const now = Date.now();
  const created = new Date(post.createdAt || Date.now()).getTime();
  const ageInHours = Math.max(1, (now - created) / (1000 * 60 * 60));

  let growthRateScore = 0;
  if (ageInHours <= 24) {
    growthRateScore = 100;
  } else if (ageInHours <= 72) {
    growthRateScore = 60;
  } else if (ageInHours <= 168) {
    growthRateScore = 30;
  } else {
    growthRateScore = 10;
  }

  // 4. Sentiment Score (normalized 0-100)
  const normalizedSentiment = Math.max(0, Math.min(100, (sentimentScore + 1) * 50));

  // 5. Freshness Time Decay factor
  const freshnessScore = Math.max(0, 100 - ageInHours * 0.5);

  // Weighted Total Calculation
  const totalScore = 
    0.35 * engagementScore +
    0.20 * readCompletionScore +
    0.20 * growthRateScore +
    0.15 * normalizedSentiment +
    0.10 * freshnessScore;

  return Math.round(totalScore * 10) / 10; // 1 decimal place precision
}

/**
 * Recalculates and updates trending scores for all published posts.
 */
async function updateAllTrendingScores() {
  try {
    const posts = await Post.find({ status: "published" });
    let updatedCount = 0;

    for (const post of posts) {
      const score = calculateTrendingScore(post);
      if (post.trendingScore !== score) {
        post.trendingScore = score;
        await post.save();
        updatedCount++;
      }
    }
    return updatedCount;
  } catch (error) {
    console.error("Error updating trending scores:", error.message);
    return 0;
  }
}

module.exports = {
  calculateTrendingScore,
  updateAllTrendingScores,
};
