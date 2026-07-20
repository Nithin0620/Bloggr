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
