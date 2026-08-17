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
      // Extractive fallback when AI key is not set
      const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [plainText.slice(0, 180) + "..."];
      const fallbackSummary = sentences.slice(0, 3).join(" ").trim();
      return res.status(200).json({
        success: true,
        data: { summary: fallbackSummary, isFallback: true },
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
      const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [plainText.slice(0, 180) + "..."];
      const fallbackSummary = sentences.slice(0, 3).join(" ").trim();
      return res.status(200).json({ success: true, data: { summary: fallbackSummary, isFallback: true } });
    }

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const match = result.match(/"summary"\s*:\s*"([^"]+)"/);
      if (match) {
        parsed = { summary: match[1] };
      } else {
        const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [plainText.slice(0, 180) + "..."];
        parsed = { summary: sentences.slice(0, 3).join(" ").trim() };
      }
    }

    if (!parsed.summary) {
      const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [plainText.slice(0, 180) + "..."];
      parsed = { summary: sentences.slice(0, 3).join(" ").trim() };
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
    logger.warn("AI summarization using fallback due to error:", { error: err.message });
    const sentences = stripHtml(req.body?.content || "").match(/[^.!?]+[.!?]+/g) || [(req.body?.content || "").slice(0, 180) + "..."];
    const fallbackSummary = sentences.slice(0, 3).join(" ").trim() || "Overview not available.";
    return res.status(200).json({ success: true, data: { summary: fallbackSummary, isFallback: true } });
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

exports.aiGenerateBio = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    const User = require("../models/user");
    const Profile = require("../models/profile");

    const user = await User.findById(userId).populate({
      path: "profile",
      populate: {
        path: "posts",
        select: "title summary content createdAt",
        options: { sort: { createdAt: -1 }, limit: 15 },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const posts = user.profile?.posts || [];

    if (posts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Write some posts first before generating a bio",
      });
    }

    const postsSummary = posts
      .map((p) => {
        const text = p.summary || stripHtml(p.content).slice(0, 200);
        return `- "${p.title}": ${text}`;
      })
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional bio writer. Given a user's blog posts, generate a compelling professional bio that reflects their expertise, writing style, and interests.

Return ONLY a valid JSON object with this exact format:
{"bio": "Your generated bio here"}

Rules:
- Bio must be 2-3 sentences, under 200 characters
- Mention their areas of expertise based on post topics
- Sound professional but personable
- Highlight what makes them unique as a writer/thinker
- Do NOT be generic — reference specific topics they write about
- Do NOT include any text outside the JSON object`,
        },
        {
          role: "user",
          content: `Author: ${user.firstName} ${user.lastName}\n\nTheir recent posts:\n${postsSummary}`,
        },
      ],
      max_tokens: 256,
      temperature: 0.5,
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
      const bioMatch = result.match(/"bio"\s*:\s*"([^"]+)"/);
      if (bioMatch) {
        parsed = { bio: bioMatch[1] };
      } else {
        return res.status(500).json({ success: false, message: "AI returned invalid response" });
      }
    }

    if (!parsed.bio) {
      return res.status(500).json({ success: false, message: "AI response missing bio" });
    }

    logger.info("AI bio generation completed", {
      bioLength: parsed.bio.length,
      postsCount: posts.length,
      userId,
    });

    return res.status(200).json({
      success: true,
      data: { bio: parsed.bio },
    });
  } catch (err) {
    logger.error("AI bio generation error", { error: err.message, stack: err.stack });
    return res.status(500).json({
      success: false,
      message: "AI bio generation failed. Please try again.",
    });
  }
};

exports.aiSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI search not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    const Post = require("../models/post");
    const Category = require("../models/category");

    const categories = await Category.find({}, "name").lean();
    const categoryNames = categories.map((c) => c.name);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a blog search assistant. Given a natural language search query, extract search parameters.

Return ONLY a valid JSON object with this exact format:
{"keywords": ["keyword1", "keyword2"], "categories": ["Category Name"], "intent": "brief description of what the user is looking for"}

Rules:
- Extract 2-5 relevant keywords from the query for text search
- If the query mentions specific categories, include them (only use from this list: ${categoryNames.join(", ")})
- The intent should be a brief 5-10 word description of what the user wants
- Keep keywords focused and relevant
- Do NOT include any text outside the JSON object
- Do NOT use markdown code blocks`,
        },
        {
          role: "user",
          content: `Search query: "${query}"`,
        },
      ],
      max_tokens: 256,
      temperature: 0.2,
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
      const keywordsMatch = result.match(/"keywords"\s*:\s*\[([^\]]+)\]/);
      if (keywordsMatch) {
        parsed = {
          keywords: keywordsMatch[1].split(",").map((s) => s.replace(/"/g, "").trim()),
          categories: [],
          intent: query,
        };
      } else {
        return res.status(500).json({ success: false, message: "AI returned invalid response" });
      }
    }

    const keywords = (parsed.keywords || []).filter(Boolean);
    const searchCategories = (parsed.categories || []).filter((c) => categoryNames.includes(c));

    if (keywords.length === 0 && searchCategories.length === 0) {
      keywords.push(query);
    }

    const matchStage = { status: "published" };

    if (keywords.length > 0) {
      matchStage.$text = { $search: keywords.join(" ") };
    }

    if (searchCategories.length > 0) {
      const catDocs = await Category.find({ name: { $in: searchCategories } }, "_id").lean();
      matchStage.categories = { $in: catDocs.map((c) => c._id) };
    }

    let posts;
    if (keywords.length > 0) {
      posts = await Post.find(matchStage, { score: { $meta: "textScore" } })
        .populate("author", "firstName lastName profilePic")
        .populate("categories", "name")
        .populate("likes", "firstName lastName")
        .populate({ path: "comments", populate: { path: "user", select: "firstName lastName image" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(20)
        .lean();
    } else {
      posts = await Post.find(matchStage)
        .populate("author", "firstName lastName profilePic")
        .populate("categories", "name")
        .populate("likes", "firstName lastName")
        .populate({ path: "comments", populate: { path: "user", select: "firstName lastName image" } })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    }

    logger.info("AI search completed", {
      query,
      keywords,
      categories: searchCategories,
      resultsCount: posts.length,
      userId: req.user?.user?._id,
    });

    return res.status(200).json({
      success: true,
      data: {
        posts,
        meta: {
          intent: parsed.intent || "",
          keywords,
          categories: searchCategories,
        },
      },
    });
  } catch (err) {
    logger.error("AI search error", { error: err.message, stack: err.stack });
    return res.status(500).json({
      success: false,
      message: "AI search failed. Please try again.",
    });
  }
};

exports.aiSentimentScore = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI assistant not configured. Add GROQ_API_KEY to backend/.env",
      });
    }

    const Post = require("../models/post");

    const posts = await Post.find({ status: "published" })
      .populate("comments")
      .populate("likes")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    if (!posts.length) {
      return res.status(200).json({ success: true, data: { scored: 0 } });
    }

    const postsWithComments = posts.filter((p) => p.comments && p.comments.length > 0);

    if (postsWithComments.length === 0) {
      for (const post of posts) {
        const baseScore = (post.likes?.length || 0) * 2 + (post.views || 0) * 0.1;
        await Post.findByIdAndUpdate(post._id, {
          sentimentScore: baseScore,
          sentimentUpdatedAt: new Date(),
        });
      }
      return res.status(200).json({ success: true, data: { scored: posts.length } });
    }

    const batchSize = 5;
    for (let i = 0; i < postsWithComments.length; i += batchSize) {
      const batch = postsWithComments.slice(i, i + batchSize);

      const commentData = batch.map((post) => ({
        postId: post._id.toString(),
        comments: post.comments.map((c) => (typeof c === "string" ? c : c.text || "")).filter(Boolean),
      }));

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a sentiment analysis assistant. For each post, analyze the sentiment of its comments and return a score.

Return ONLY a valid JSON object with this exact format:
{"scores": [{"postId": "the post id", "positive": 0.7, "neutral": 0.2, "negative": 0.1}]}

Rules:
- positive/neutral/negative are ratios that sum to ~1.0
- Be concise, only return the JSON object
- If a comment is positive (praise, thanks, agreement, excitement), count it as positive
- If a comment is negative (criticism, complaints, disagreement), count it as negative
- Otherwise neutral
- Do NOT include any text outside the JSON object`,
          },
          {
            role: "user",
            content: JSON.stringify(commentData),
          },
        ],
        max_tokens: 1024,
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      let result = completion.choices[0]?.message?.content?.trim();
      let parsed;
      try {
        parsed = JSON.parse(result);
      } catch {
        continue;
      }

      const scoresMap = {};
      for (const s of parsed.scores || []) {
        scoresMap[s.postId] = s;
      }

      for (const post of batch) {
        const sentiment = scoresMap[post._id.toString()];
        const likes = post.likes?.length || 0;
        const views = post.views || 0;
        const comments = post.comments?.length || 0;
        const positiveRatio = sentiment?.positive || 0.5;

        const score =
          likes * 2 +
          positiveRatio * comments * 5 +
          views * 0.1;

        await Post.findByIdAndUpdate(post._id, {
          sentimentScore: Math.round(score * 100) / 100,
          sentimentUpdatedAt: new Date(),
        });
      }
    }

    for (const post of posts) {
      if (!postsWithComments.find((p) => p._id.toString() === post._id.toString())) {
        const baseScore = (post.likes?.length || 0) * 2 + (post.views || 0) * 0.1;
        await Post.findByIdAndUpdate(post._id, {
          sentimentScore: baseScore,
          sentimentUpdatedAt: new Date(),
        });
      }
    }

    logger.info("Sentiment scoring completed", { totalScored: posts.length });

    return res.status(200).json({
      success: true,
      data: { scored: posts.length },
    });
  } catch (err) {
    logger.error("Sentiment scoring error", { error: err.message, stack: err.stack });
    return res.status(500).json({
      success: false,
      message: "Sentiment scoring failed. Please try again.",
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
