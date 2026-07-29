const { Queue } = require("bullmq");
const logger = require("../configuration/logger");
const { getRedisConnection } = require("./embeddingQueue");

const connection = getRedisConnection();

const trendQueue = new Queue("trend-queue", {
  connection,
});

async function addTrendJob() {
  try {
    const job = await trendQueue.add(
      "update-trending",
      {},
      {
        repeat: { pattern: "0 * * * *" },
        removeOnComplete: true,
      }
    );
    if (logger && logger.info) {
      logger.info(`Scheduled trend update job ${job.id}`);
    }
    return job;
  } catch (error) {
    console.error("Failed to add trend job to queue:", error.message);
  }
}

module.exports = {
  trendQueue,
  addTrendJob,
};
