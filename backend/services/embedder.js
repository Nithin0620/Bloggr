/**
 * Local vector embedding generator using @xenova/transformers
 * Model: Xenova/all-MiniLM-L6-v2 (384 dimensions, fast & local)
 */

let pipelinePromise = null;

async function getExtractor() {
  if (!pipelinePromise) {
    // Dynamic import inside async function to handle ESM/CJS cleanly if needed
    const { pipeline } = await import("@xenova/transformers");
    pipelinePromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return pipelinePromise;
}

/**
 * Generates 384-dim normalized embedding array for input string
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
async function generateEmbedding(text) {
  try {
    const extractor = await getExtractor();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error("Failed to generate embedding:", error);
    throw error;
  }
}

module.exports = {
  generateEmbedding,
};
