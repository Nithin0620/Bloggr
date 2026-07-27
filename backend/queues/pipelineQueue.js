const { Queue } = require("bullmq");
const logger = require("../configuration/logger");
const { getRedisConnection } = require("./embeddingQueue");

const connection = getRedisConnection();

const pipelineQueue = new Queue("pipeline-queue", {
  connection,
});

/**
 * Queue an article for AI publishing enrichment
 * @param {object} jobData { postId, title, content, categories, tags }
 */
async function addPipelineJob(jobData) {
  try {
    const job = await pipelineQueue.add("process-pipeline", jobData, {
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
    });
    if (logger && logger.info) {
      logger.info(`Queued AI pipeline job ${job.id} for post ${jobData.postId}`);
    }
    return job;
  } catch (error) {
    console.error("Failed to add AI pipeline job to queue:", error.message);
  }
}

module.exports = {
  pipelineQueue,
  addPipelineJob,
};
