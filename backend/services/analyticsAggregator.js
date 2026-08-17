const Post = require("../models/post");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = process.env.GROQ_MODEL || "groq/compound-mini";

async function getAuthorStats(authorId) {
  const posts = await Post.find({ author: authorId })
    .populate("categories", "name")
    .populate("tags", "name");

  const totalPosts = posts.length;
  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;

  posts.forEach((p) => {
    totalViews += p.views || 0;
    totalLikes += p.likes ? p.likes.length : 0;
    totalComments += p.comments ? p.comments.length : 0;
  });

  const avgViewsPerPost = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;
  const avgLikesPerPost = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;

  const topPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3)
    .map((p) => ({
      _id: p._id,
      title: p.title,
      views: p.views || 0,
      likesCount: p.likes ? p.likes.length : 0,
      createdAt: p.createdAt,
    }));

  return {
    totalPosts,
    totalViews,
    totalLikes,
    totalComments,
    avgViewsPerPost,
    avgLikesPerPost,
    topPosts,
    posts,
  };
}

async function generateInsights(statsSummary) {
  const defaults = [
    "Keep publishing regularly to increase reader engagement.",
    "Articles with detailed code snippets tend to get more bookmarks.",
    "Your top post has generated over 50% of your total views.",
  ];

  if (!statsSummary || !process.env.GROQ_API_KEY) return defaults;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            'You are a content analytics AI advisor for bloggers. Given author metrics, provide 3 short, actionable, punchy bullet point insights (under 20 words each). Return ONLY a JSON array of strings: ["insight 1", "insight 2", "insight 3"]',
        },
        { role: "user", content: statsSummary },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed.insights && Array.isArray(parsed.insights)) return parsed.insights;
    }
  } catch (err) {
    console.warn("AI insights generation warning:", err.message);
  }

  return defaults;
}

module.exports = {
  getAuthorStats,
  generateInsights,
};
