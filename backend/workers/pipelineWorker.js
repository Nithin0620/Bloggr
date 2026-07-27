const { Worker } = require("bullmq");
const Post = require("../models/post");
const { enrichArticle } = require("../services/aiPipeline");
const { getRedisConnection } = require("../queues/embeddingQueue");

let worker = null;

function startPipelineWorker() {
  if (worker) return worker;

  const connection = getRedisConnection();

  worker = new Worker(
    "pipeline-queue",
    async (job) => {
      const { postId, title, content, categories, tags } = job.data;
      console.log(`[Pipeline Worker] Enriching article metadata: ${postId} ("${title}")`);

      try {
        const enrichedData = await enrichArticle({ title, content, categories, tags });
        if (!enrichedData) {
          console.warn(`[Pipeline Worker] No enrichment returned for article ${postId}`);
          return;
        }

        const updatePayload = {};
        if (enrichedData.grammar) updatePayload.grammar = enrichedData.grammar;
        if (enrichedData.seo) updatePayload.seo = enrichedData.seo;
        if (enrichedData.difficulty) updatePayload.difficulty = enrichedData.difficulty;
        if (enrichedData.summaries) updatePayload.summaries = enrichedData.summaries;

        await Post.findByIdAndUpdate(postId, updatePayload);
        console.log(`[Pipeline Worker] Successfully enriched article ${postId}`);
      } catch (error) {
        console.error(`[Pipeline Worker] Failed to enrich article ${postId}:`, error.message);
        throw error;
      }
    },
    {
      connection,
      concurrency: 2,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[Pipeline Worker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}

module.exports = {
  startPipelineWorker,
};
