const Post = require("../models/post");
const Groq = require("groq-sdk");
const { stripHtml } = require("../services/chunker");
const { generateEmbedding } = require("../services/embedder");
const { searchSimilarChunks } = require("../services/vectorStore");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = process.env.GROQ_MODEL || "groq/compound-mini";

exports.askAboutArticle = async (req, res) => {
  try {
    const { articleId, question } = req.body;

    if (!articleId || !question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "articleId and question are required",
      });
    }

    const post = await Post.findById(articleId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    // 1. Generate query vector & filter Qdrant for this specific article
    const queryVector = await generateEmbedding(question.trim());
    const matches = await searchSimilarChunks(queryVector, 5, {
      must: [
        {
          key: "articleId",
          match: { value: articleId.toString() },
        },
      ],
    });

    let contextText = "";
    if (matches && matches.length > 0) {
      contextText = matches.map((m) => m.payload.chunkText).join("\n\n");
    } else {
      // Fallback to post content snippet if vector store is empty
      contextText = stripHtml(post.content).substring(0, 3000);
    }

    const systemPrompt = `You are an AI reading assistant embedded in the article titled "${post.title}".
Answer the reader's question accurately and helpfully based strictly on the article context provided below.

ARTICLE TITLE: "${post.title}"
ARTICLE CONTENT CONTEXT:
${contextText}

Instructions:
- Keep your answer clear, helpful, and directly related to the article context.
- If the answer cannot be found in the article, state politely that the article does not cover that specific detail.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question.trim() },
      ],
      temperature: 0.3,
    });

    const answer = completion.choices[0]?.message?.content || "I couldn't generate an answer.";

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Reader assistant error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to answer question about article",
    });
  }
};

exports.summarizeArticle = async (req, res) => {
  try {
    const { articleId, type = "tldr" } = req.body;

    const post = await Post.findById(articleId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    const plainText = stripHtml(post.content).substring(0, 4000);

    let instruction = "Provide a concise 2-sentence TL;DR summary.";
    if (type === "bullet") instruction = "Provide 3-5 bullet points highlighting the main key takeaways.";
    if (type === "eli5") instruction = "Explain the concepts in this article in simple terms like I am 12 years old.";
    if (type === "oneliner") instruction = "Provide a single punchy one-liner summary.";

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert article summarizer. ${instruction}`,
        },
        {
          role: "user",
          content: `ARTICLE TITLE: "${post.title}"\nCONTENT:\n${plainText}`,
        },
      ],
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content || "";

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Summarize article error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate summary",
    });
  }
};
