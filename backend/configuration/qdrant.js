const { QdrantClient } = require("@qdrant/js-client-rest");
const logger = require("./logger");

const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
const qdrantApiKey = process.env.QDRANT_API_KEY || undefined;

const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
  checkCompatibility: false,
});

const COLLECTION_NAME = "bloggr_articles";
const VECTOR_SIZE = 384; // all-MiniLM-L6-v2 dimension

async function initQdrantCollection() {
  try {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

    if (!exists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });
      if (logger && logger.info) {
        logger.info(`Created Qdrant collection: ${COLLECTION_NAME}`);
      } else {
        console.log(`Created Qdrant collection: ${COLLECTION_NAME}`);
      }
    }
  } catch (error) {
    console.warn("Qdrant connection warning (Make sure Qdrant container is running):", error.message);
  }
}

module.exports = {
  qdrantClient,
  COLLECTION_NAME,
  VECTOR_SIZE,
  initQdrantCollection,
};
