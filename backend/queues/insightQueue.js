const { Queue } = require("bullmq");
const logger = require("../configuration/logger");
const { getRedisConnection } = require("./embeddingQueue");

const connection = getRedisConnection();

const insightQueue = new Queue("insight-queue", {
  connection,
});

async function addInsightJob() {
  try {
    const job = await insightQueue.add(
      "generate-insights",
      {},
      {
        repeat: { pattern: "0 0 * * 0" },
        removeOnComplete: true,
      }
    );
    if (logger && logger.info) {
      logger.info(`Scheduled weekly insight generation job ${job.id}`);
    }
    return job;
  } catch (error) {
    console.error("Failed to add insight job to queue:", error.message);
  }
}

module.exports = {
  insightQueue,
  addInsightJob,
};
