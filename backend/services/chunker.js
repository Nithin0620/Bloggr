/**
 * Service to chunk article text into manageable semantic blocks with overlap.
 */

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Chunks text into blocks of ~chunkSize words with ~overlap words overlap.
 * @param {string} text - Raw text or HTML content
 * @param {number} chunkSize - Maximum words per chunk (default 300)
 * @param {number} overlap - Overlapping words between chunks (default 50)
 * @returns {Array<{ chunkIndex: number, text: string }>}
 */
function chunkText(text, chunkSize = 300, overlap = 50) {
  const cleanText = stripHtml(text);
  if (!cleanText) return [];

  const words = cleanText.split(/\s+/);
  if (words.length <= chunkSize) {
    return [{ chunkIndex: 0, text: cleanText }];
  }

  const chunks = [];
  let chunkIndex = 0;
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunkWords = words.slice(start, end);
    chunks.push({
      chunkIndex,
      text: chunkWords.join(" "),
    });

    chunkIndex++;
    start += chunkSize - overlap;
  }

  return chunks;
}

module.exports = {
  stripHtml,
  chunkText,
};
