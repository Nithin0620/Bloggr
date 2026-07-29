const { Queue } = require("bullmq");
const logger = require("../configuration/logger");
const { getRedisConnection } = require("./embeddingQueue");

const connection = getRedisConnection();

const podcastQueue = new Queue("podcast-queue", {
  connection,
});

async function addPodcastJob(postId, title, content, summary) {
  try {
    const job = await podcastQueue.add("generate-podcast", { postId, title, content, summary }, {
      attempts: 2,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
    });
    if (logger && logger.info) {
      logger.info(`Queued podcast job ${job.id} for post ${postId}`);
    }
    return job;
  } catch (error) {
    console.error("Failed to add podcast job to queue:", error.message);
  }
}

module.exports = {
  podcastQueue,
  addPodcastJob,
};
