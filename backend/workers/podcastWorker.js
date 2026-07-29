const { Worker } = require("bullmq");
const Post = require("../models/post");
const { generatePodcast } = require("../services/podcastGenerator");
const { getRedisConnection } = require("../queues/embeddingQueue");
const logger = require("../configuration/logger");

let worker = null;

function startPodcastWorker() {
  if (worker) return worker;

  const connection = getRedisConnection();

  worker = new Worker(
    "podcast-queue",
    async (job) => {
      const { postId, title, content, summary } = job.data;
      logger.info(`[Podcast Worker] Generating podcast for ${postId} ("${title}")`);

      try {
        await Post.findByIdAndUpdate(postId, { "podcast.status": "processing" });

        const result = await generatePodcast({ title, content, summary });

        await Post.findByIdAndUpdate(postId, {
          "podcast.status": "completed",
          "podcast.script": result.script,
          "podcast.audioUrl": result.audioUrl,
          "podcast.duration": result.duration,
        });

        logger.info(`[Podcast Worker] Podcast completed for ${postId}`);
      } catch (error) {
        logger.error(`[Podcast Worker] Error for ${postId}: ${error.message}`);
        await Post.findByIdAndUpdate(postId, { "podcast.status": "failed" });
        throw error;
      }
    },
    { connection, concurrency: 1 }
  );

  worker.on("completed", (job) => logger.info(`[Podcast Worker] Job ${job.id} completed`));
  worker.on("failed", (job, err) => logger.error(`[Podcast Worker] Job ${job?.id} failed: ${err.message}`));

  return worker;
}

module.exports = { startPodcastWorker };
