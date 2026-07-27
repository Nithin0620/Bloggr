const { crypto, randomUUID } = require("crypto");
const { qdrantClient, COLLECTION_NAME } = require("../configuration/qdrant");

/**
 * Upsert chunks of an article into Qdrant vector database.
 * First deletes existing chunks for the given articleId to avoid duplicates.
 */
async function upsertArticleChunks(articleId, chunksWithEmbeddings, metadata = {}) {
  try {
    // 1. Remove any prior chunks for this article
    await deleteArticleChunks(articleId);

    if (!chunksWithEmbeddings || chunksWithEmbeddings.length === 0) {
      return;
    }

    // 2. Format Qdrant points
    const points = chunksWithEmbeddings.map(({ chunkIndex, text, embedding }) => ({
      id: randomUUID ? randomUUID() : require("crypto").randomBytes(16).toString("hex"),
      vector: embedding,
      payload: {
        articleId: articleId.toString(),
        chunkIndex,
        chunkText: text,
        title: metadata.title || "",
        authorId: metadata.authorId ? metadata.authorId.toString() : "",
        authorName: metadata.authorName || "",
        tags: metadata.tags || [],
        categories: metadata.categories || [],
        createdAt: metadata.createdAt || new Date().toISOString(),
      },
    }));

    // 3. Upsert into Qdrant
    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points,
    });
  } catch (error) {
    console.error(`Failed to upsert article ${articleId} into Qdrant:`, error.message);
    throw error;
  }
}

/**
 * Delete all vector points associated with an articleId
 */
async function deleteArticleChunks(articleId) {
  try {
    await qdrantClient.delete(COLLECTION_NAME, {
      filter: {
        must: [
          {
            key: "articleId",
            match: {
              value: articleId.toString(),
            },
          },
        ],
      },
    });
  } catch (error) {
    // Ignore error if collection or points don't exist yet
    console.warn(`Note on deleting chunks for article ${articleId}:`, error.message);
  }
}

/**
 * Search similar vectors in Qdrant
 * @param {number[]} queryVector 
 * @param {number} limit 
 * @param {object} filter 
 */
async function searchSimilarChunks(queryVector, limit = 20, filter = null) {
  try {
    const searchResult = await qdrantClient.search(COLLECTION_NAME, {
      vector: queryVector,
      limit,
      filter: filter || undefined,
    });
    return searchResult;
  } catch (error) {
    console.error("Vector search failed:", error.message);
    return [];
  }
}

module.exports = {
  upsertArticleChunks,
  deleteArticleChunks,
  searchSimilarChunks,
};
