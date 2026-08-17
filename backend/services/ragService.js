const Groq = require("groq-sdk");
const { generateEmbedding } = require("./embedder");
const { searchSimilarChunks } = require("./vectorStore");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = process.env.GROQ_MODEL || "groq/compound-mini";

async function askRagChat({ question, history = [] }) {
  const queryVector = await generateEmbedding(question.trim());
  const matches = await searchSimilarChunks(queryVector, 8);

  const citationsMap = new Map();
  const contextBlocks = [];

  if (matches && matches.length > 0) {
    matches.forEach((m, idx) => {
      const payload = m.payload || {};
      const title = payload.title || "Untitled Article";
      const articleId = payload.articleId || "";
      const chunkText = payload.chunkText || "";

      if (articleId && !citationsMap.has(articleId)) {
        citationsMap.set(articleId, {
          articleId,
          articleTitle: title,
          chunkText: chunkText.substring(0, 150) + "...",
          score: m.score ? Math.round(m.score * 100) : 0,
        });
      }

      contextBlocks.push(`[Source ${idx + 1}: "${title}"]\n${chunkText}`);
    });
  }

  const contextText = contextBlocks.join("\n\n---\n\n");
  const citationsList = Array.from(citationsMap.values());

  const systemPrompt = `You are Bloggr AI, an intelligent knowledge assistant for the Bloggr platform.
Answer the user's question accurately using the provided article contexts from published blog posts.

CONTEXT SOURCES:
${contextText || "No relevant articles found in vector index."}

Instructions:
- Base your response primarily on the provided context sources.
- Mention article titles when attributing information.
- Be concise, professional, and helpful.
- If the sources do not contain enough information to answer, answer based on general knowledge but state that no specific Bloggr article was matched.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-4),
    { role: "user", content: question.trim() },
  ];

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    temperature: 0.3,
  });

  const answer = completion.choices[0]?.message?.content || "I couldn't generate an answer.";

  return { answer, citations: citationsList, contextText };
}

module.exports = { askRagChat };
