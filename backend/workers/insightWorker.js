const { Worker } = require("bullmq");
const User = require("../models/user");
const Insight = require("../models/insight");
const { getAuthorStats, generateInsights } = require("../services/analyticsAggregator");
const { getRedisConnection } = require("../queues/embeddingQueue");
const logger = require("../configuration/logger");

let worker = null;

function startInsightWorker() {
  if (worker) return worker;

  const connection = getRedisConnection();

  worker = new Worker(
    "insight-queue",
    async (job) => {
      logger.info("[Insight Worker] Generating weekly insights for all authors...");
      try {
        const authors = await User.find({});
        let generatedCount = 0;

        for (const author of authors) {
          try {
            const stats = await getAuthorStats(author._id);
            if (stats.totalPosts === 0) continue;

            const statsSummary = `Total Posts: ${stats.totalPosts}, Total Views: ${stats.totalViews}, Total Likes: ${stats.totalLikes}, Total Comments: ${stats.totalComments}. Top Post: "${stats.topPosts[0]?.title || "N/A"}" with ${stats.topPosts[0]?.views || 0} views.`;
            const insights = await generateInsights(statsSummary);

            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);

            await Insight.findOneAndUpdate(
              { user: author._id, weekStart },
              { insights, weekStart },
              { upsert: true }
            );

            generatedCount++;
          } catch (authorErr) {
            logger.warn(`[Insight Worker] Skipped author ${author._id}: ${authorErr.message}`);
          }
        }

        logger.info(`[Insight Worker] Generated insights for ${generatedCount} authors`);
        return generatedCount;
      } catch (error) {
        logger.error(`[Insight Worker] Error: ${error.message}`);
        throw error;
      }
    },
    {
      connection,
      concurrency: 1,
    }
  );

  worker.on("completed", (job) => {
    logger.info(`[Insight Worker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`[Insight Worker] Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}

module.exports = {
  startInsightWorker,
};
