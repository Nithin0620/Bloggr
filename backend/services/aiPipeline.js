const Groq = require("groq-sdk");
const logger = require("../configuration/logger");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Enriches a blog post with Grammar, SEO, Summaries, and Difficulty metrics using Groq LLM in 1 pass.
 */
async function enrichArticle({ title, content, categories = [], tags = [] }) {
  const plainText = stripHtml(content);
  if (!plainText || plainText.length < 30) {
    return null;
  }

  const prompt = `You are an expert editorial AI system for a blogging platform.
Analyze the following article and generate comprehensive metadata.

ARTICLE TITLE: "${title}"
CATEGORIES: ${JSON.stringify(categories)}
TAGS: ${JSON.stringify(tags)}
CONTENT:
${plainText.substring(0, 4000)}

Perform analysis and return ONLY a valid JSON object with the exact structure below:
{
  "grammar": {
    "score": 88,
    "issues": [
      {
        "paragraph": 1,
        "original": "exact original text snippet with issue",
        "suggestion": "improved corrected text",
        "type": "grammar | spelling | clarity"
      }
    ]
  },
  "seo": {
    "score": 85,
    "metaTitle": "SEO title under 60 chars",
    "metaDescription": "Compelling meta description under 155 chars",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "issues": ["Issue or suggestion 1", "Issue 2"]
  },
  "difficulty": {
    "level": "beginner | intermediate | advanced",
    "readingGrade": 8,
    "vocabularyComplexity": "Low | Moderate | High",
    "technicalDensity": "Low | Moderate | High"
  },
  "summaries": {
    "tldr": "1-2 sentence quick summary",
    "bulletPoints": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
    "summary100": "100-word concise summary of the article",
    "oneLiner": "Catchy single-line punchline"
  }
}

Rules:
1. Ensure grammar score is an integer between 0 and 100.
2. Ensure SEO score is an integer between 0 and 100.
3. Level must be exactly one of: "beginner", "intermediate", "advanced".
4. Do NOT output any markdown code block or extra explanation outside the raw JSON string.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    if (!responseText) return null;

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error("AI Publishing Pipeline failed:", error.message);
    return null;
  }
}

module.exports = {
  enrichArticle,
};
