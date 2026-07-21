const Groq = require("groq-sdk");
const logger = require("../configuration/logger");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
};

exports.aiGenerateMeta = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Post content is required to generate title and summary",
      });
    }

    const plainText = stripHtml(content);

    if (!plainText || plainText.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Content too short to generate meaningful title and summary",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a blog post metadata generator. Given a blog post's content, generate a catchy title and a short summary (1-2 sentences, under 30 words).

Return ONLY a valid JSON object with this exact format:
{"title": "your generated title here", "summary": "your generated summary here"}

Rules:
- Title: catchy, engaging, under 80 characters, no quotes
- Summary: concise, compelling, under 30 words, no quotes
- Do NOT include any text outside the JSON object
- Do NOT use markdown code blocks`,
        },
        {
          role: "user",
          content: `Generate a title and summary for this blog post:\n\n${plainText.slice(0, 4000)}`,
        },
      ],
      max_tokens: 256,
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    let result = completion.choices[0]?.message?.content?.trim();

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response",
      });
    }

    let meta;
    try {
      meta = JSON.parse(result);
    } catch (parseErr) {
      const titleMatch = result.match(/"title"\s*:\s*"([^"]+)"/);
      const summaryMatch = result.match(/"summary"\s*:\s*"([^"]+)"/);

      if (titleMatch && summaryMatch) {
        meta = { title: titleMatch[1], summary: summaryMatch[1] };
      } else {
        logger.error("AI meta parse failed", { result, parseErr: parseErr.message });
        return res.status(500).json({
          success: false,
          message: "AI returned invalid response. Please try again.",
        });
      }
    }

    if (!meta.title || !meta.summary) {
      return res.status(500).json({
        success: false,
        message: "AI response missing title or summary",
      });
    }

    logger.info("AI meta generation completed", {
      titleLength: meta.title.length,
      summaryLength: meta.summary.length,
      inputLength: plainText.length,
      userId: req.user?.user?._id,
    });

    return res.status(200).json({
      success: true,
      data: {
        title: meta.title,
        summary: meta.summary,
      },
    });
  } catch (err) {
    logger.error("AI meta generation error", { error: err.message, stack: err.stack });

    if (err.message?.includes("GROQ_API_KEY")) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI assistant failed. Please try again.",
    });
  }
};

exports.aiSuggestCategories = async (req, res) => {
  try {
    const { content, categories } = req.body;

    if (!content || !categories || !categories.length) {
      return res.status(400).json({
        success: false,
        message: "Content and categories list are required",
      });
    }

    const plainText = stripHtml(content);
    if (!plainText || plainText.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Content too short to suggest categories",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a blog categorization assistant. Given a blog post's content and a list of available categories, pick the 1-3 most relevant categories.

Return ONLY a valid JSON object with this exact format:
{"categories": ["Category Name 1", "Category Name 2"]}

Rules:
- Pick 1-3 categories from the provided list that best match the content
- Only use categories from the provided list exactly as spelled
- Do NOT invent new category names
- Do NOT include any text outside the JSON object`,
        },
        {
          role: "user",
          content: `Available categories: ${categories.join(", ")}\n\nBlog post content:\n${plainText.slice(0, 3000)}`,
        },
      ],
      max_tokens: 128,
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    let result = completion.choices[0]?.message?.content?.trim();
    if (!result) {
      return res.status(500).json({ success: false, message: "AI returned empty response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const match = result.match(/"categories"\s*:\s*\[([^\]]+)\]/);
      if (match) {
        parsed = { categories: match[1].split(",").map(s => s.replace(/"/g, "").trim()) };
      } else {
        return res.status(500).json({ success: false, message: "AI returned invalid response" });
      }
    }

    const suggested = (parsed.categories || []).filter(c => categories.includes(c));

    logger.info("AI category suggestion completed", {
      inputLength: plainText.length,
      suggestedCount: suggested.length,
      userId: req.user?.user?._id,
    });

    return res.status(200).json({ success: true, data: { categories: suggested } });
  } catch (err) {
    logger.error("AI category suggestion error", { error: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: "AI assistant failed. Please try again." });
  }
};

exports.aiSummarize = async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Post content is required" });
    }

    const plainText = stripHtml(content);
    if (!plainText || plainText.length < 50) {
      return res.status(400).json({ success: false, message: "Content too short to summarize" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert blog post summarizer. Read the entire blog post carefully and create a detailed, comprehensive TL;DR summary that captures the essence of the full post.

Return ONLY a valid JSON object with this exact format:
{"summary": "Your detailed TL;DR summary here"}

Rules:
- Summary must be 4-6 sentences, between 100-150 words
- Start with the main topic/argument of the post
- Cover ALL key points, sub-arguments, and actionable takeaways in order
- Include specific details, examples, tips, or numbers mentioned in the post
- Mention any tools, frameworks, techniques, or resources the author recommends
- Write in an engaging third-person style that gives the reader real value even without reading the full post
- Be specific — never use vague phrases like "various things" or "multiple points"
- Do NOT include any text outside the JSON object
- Do NOT use markdown formatting inside the summary string`,
        },
        {
          role: "user",
          content: `Generate a TL;DR for this blog post:\n\n${plainText.slice(0, 4000)}`,
        },
      ],
      max_tokens: 256,
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    let result = completion.choices[0]?.message?.content?.trim();
    if (!result) {
      return res.status(500).json({ success: false, message: "AI returned empty response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const match = result.match(/"summary"\s*:\s*"([^"]+)"/);
      if (match) {
        parsed = { summary: match[1] };
      } else {
        return res.status(500).json({ success: false, message: "AI returned invalid response" });
      }
    }

    if (!parsed.summary) {
      return res.status(500).json({ success: false, message: "AI response missing summary" });
    }

    if (postId) {
      try {
        const Post = require("../models/post");
        await Post.findByIdAndUpdate(postId, { summary: parsed.summary });
      } catch (e) {
        logger.warn("Failed to cache summary on post", { postId, error: e.message });
      }
    }

    logger.info("AI summarization completed", {
      summaryLength: parsed.summary.length,
      inputLength: plainText.length,
      userId: req.user?.user?._id,
    });

    return res.status(200).json({ success: true, data: { summary: parsed.summary } });
  } catch (err) {
    logger.error("AI summarization error", { error: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: "AI assistant failed. Please try again." });
  }
};

exports.aiSuggestComment = async (req, res) => {
  try {
    const { postTitle, postContent } = req.body;

    if (!postTitle && !postContent) {
      return res.status(400).json({ success: false, message: "Post title or content is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    const plainPost = postContent ? stripHtml(postContent).slice(0, 2000) : "";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a smart blog comment assistant. Given a blog post, suggest 3 thoughtful, genuine comments a reader might leave.

Return ONLY a valid JSON object with this exact format:
{"comments": ["Comment option 1", "Comment option 2", "Comment option 3"]}

Rules:
- Each comment must be 1-3 sentences, under 50 words
- Mix different tones: one appreciative, one engaging/questioning, one sharing a related thought
- Be genuine and specific — reference actual points from the post
- Sound like a real person, not a bot
- Do NOT be generic like "Great post!" — be specific about WHAT is great
- Do NOT include any text outside the JSON object`,
        },
        {
          role: "user",
          content: `Post: "${postTitle}"${plainPost ? `\nContent: ${plainPost}` : ""}\n\nSuggest 3 comments:`,
        },
      ],
      max_tokens: 256,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    let result = completion.choices[0]?.message?.content?.trim();
    if (!result) {
      return res.status(500).json({ success: false, message: "AI returned empty response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const match = result.match(/"comments"\s*:\s*\[([^\]]+)\]/);
      if (match) {
        parsed = { comments: match[1].split(",").map(s => s.replace(/"/g, "").trim()) };
      } else {
        return res.status(500).json({ success: false, message: "AI returned invalid response" });
      }
    }

    const comments = (parsed.comments || []).filter(Boolean).slice(0, 3);

    logger.info("AI comment suggestion completed", {
      postTitleLength: postTitle?.length || 0,
      suggestionsCount: comments.length,
      userId: req.user?.user?._id,
    });

    return res.status(200).json({ success: true, data: { comments } });
  } catch (err) {
    logger.error("AI comment suggestion error", { error: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: "AI assistant failed. Please try again." });
  }
};

exports.aiWrite = async (req, res) => {
  try {
    const { text, prompt, mode } = req.body;

    if (!text || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Text and prompt are required",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    const systemMessage =
      mode === "replace"
        ? "You are a professional writing assistant. Rewrite the user's text according to their instruction. Output ONLY the rewritten text, nothing else."
        : "You are a professional writing assistant. Continue writing from where the text left off. Match the tone and style. Output ONLY the written text, nothing else.";

    const userMessage =
      mode === "replace"
        ? `Instruction: ${prompt}\n\nOriginal text:\n${text}`
        : `Previous text:\n${text}\n\nInstruction: ${prompt}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content?.trim();

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response",
      });
    }

    logger.info("AI write completed", {
      mode,
      promptLength: prompt.length,
      inputLength: text.length,
      outputLength: result.length,
      userId: req.user?.user?._id,
    });

    return res.status(200).json({
      success: true,
      data: { result },
    });
  } catch (err) {
    logger.error("AI write error", { error: err.message, stack: err.stack });

    if (err.message?.includes("GROQ_API_KEY")) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI assistant failed. Please try again.",
    });
  }
};
