const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = process.env.GROQ_MODEL || "groq/compound-mini";

async function generateConversation({ title, content, summary }) {
  const plainText = (content || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 5000);

  const prompt = `You are a podcast script writer. Create a natural, engaging conversation between two speakers discussing the article below.

ARTICLE TITLE: "${title}"
ARTICLE SUMMARY: "${summary || "N/A"}"
ARTICLE CONTENT:
${plainText}

RULES:
- Host (Alex): leads the discussion, asks insightful questions, keeps it lively
- Guest (Sam): explains concepts, gives examples, shares insights
- 5-10 minutes of dialogue (8-15 turns total)
- Natural conversational tone with personality and occasional banter
- Cover all major points
- Keep each response 1-3 sentences
- End with a memorable sign-off

Return ONLY a JSON array of objects:
[
  { "speaker": "Host", "text": "..." },
  { "speaker": "Guest", "text": "..." }
]`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.script && Array.isArray(parsed.script)) return parsed.script;

    return [];
  } catch (error) {
    console.error("Conversation generation failed:", error.message);
    return [];
  }
}

module.exports = { generateConversation };
