const { Worker } = require("bullmq");
const { updateAllTrendingScores } = require("../services/trendCalculator");
const { getRedisConnection } = require("../queues/embeddingQueue");
const logger = require("../configuration/logger");

let worker = null;

function startTrendWorker() {
  if (worker) return worker;

  const connection = getRedisConnection();

  worker = new Worker(
    "trend-queue",
    async (job) => {
      logger.info("[Trend Worker] Updating trending scores for all published posts...");
      try {
        const updatedCount = await updateAllTrendingScores();
        logger.info(`[Trend Worker] Updated trending scores for ${updatedCount} posts`);
      } catch (error) {
        logger.error(`[Trend Worker] Error updating trending scores: ${error.message}`);
        throw error;
      }
    },
    {
      connection,
      concurrency: 1,
    }
  );

  worker.on("completed", (job) => {
    logger.info(`[Trend Worker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`[Trend Worker] Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}

module.exports = {
  startTrendWorker,
};
