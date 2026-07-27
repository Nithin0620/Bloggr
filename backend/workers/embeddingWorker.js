const { Worker } = require("bullmq");
const Post = require("../models/post");
const { chunkText } = require("../services/chunker");
const { generateEmbedding } = require("../services/embedder");
const { upsertArticleChunks } = require("../services/vectorStore");
const { getRedisConnection } = require("../queues/embeddingQueue");

let worker = null;

function startEmbeddingWorker() {
  if (worker) return worker;

  const connection = getRedisConnection();

  worker = new Worker(
    "embedding-queue",
    async (job) => {
      const { postId, title, content, authorName, tags, categories } = job.data;
      console.log(`[Embedding Worker] Processing article: ${postId} ("${title}")`);

      try {
        await Post.findByIdAndUpdate(postId, { embeddingStatus: "processing" });

        // 1. Chunk content
        const chunks = chunkText(content, 300, 50);
        if (chunks.length === 0) {
          await Post.findByIdAndUpdate(postId, { embeddingStatus: "completed" });
          return;
        }

        // 2. Generate embeddings for each chunk
        const chunksWithEmbeddings = [];
        for (const chunk of chunks) {
          const embedding = await generateEmbedding(chunk.text);
          chunksWithEmbeddings.push({
            chunkIndex: chunk.chunkIndex,
            text: chunk.text,
            embedding,
          });
        }

        // 3. Upsert vectors into Qdrant
        await upsertArticleChunks(postId, chunksWithEmbeddings, {
          title,
          authorName,
          tags,
          categories,
          createdAt: new Date().toISOString(),
        });

        // 4. Update status in MongoDB
        await Post.findByIdAndUpdate(postId, { embeddingStatus: "completed" });
        console.log(`[Embedding Worker] Successfully embedded article ${postId}`);
      } catch (error) {
        console.error(`[Embedding Worker] Error processing article ${postId}:`, error.message);
        await Post.findByIdAndUpdate(postId, { embeddingStatus: "failed" });
        throw error;
      }
    },
    {
      connection,
      concurrency: 2,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[Embedding Worker] Job ${job?.id} failed with error:`, err.message);
  });

  return worker;
}

module.exports = {
  startEmbeddingWorker,
};
