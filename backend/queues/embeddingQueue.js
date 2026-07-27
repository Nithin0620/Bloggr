const { Queue } = require("bullmq");
const logger = require("../configuration/logger");

function getRedisConnection() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  
  if (redisUrl.startsWith("rediss://") || redisUrl.startsWith("redis://")) {
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || "6379", 10),
      username: url.username || undefined,
      password: url.password || undefined,
      tls: url.protocol === "rediss:" ? { rejectUnauthorized: false } : undefined,
      maxRetriesPerRequest: null,
    };
  }
  return {
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
  };
}

const connection = getRedisConnection();

const embeddingQueue = new Queue("embedding-queue", {
  connection,
});

/**
 * Queue an article for embedding processing
 * @param {object} jobData { postId, title, content, authorName, tags, categories }
 */
async function addEmbeddingJob(jobData) {
  try {
    const job = await embeddingQueue.add("process-embedding", jobData, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
    });
    if (logger && logger.info) {
      logger.info(`Queued embedding job ${job.id} for post ${jobData.postId}`);
    }
    return job;
  } catch (error) {
    console.error("Failed to add embedding job to queue:", error.message);
  }
}

module.exports = {
  embeddingQueue,
  addEmbeddingJob,
  getRedisConnection,
};
