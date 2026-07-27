const Post = require("../models/post");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.getAuthorDashboard = async (req, res) => {
  try {
    const authorId = req.user.user._id;

    // 1. Fetch all posts by author
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

    // Sort top 3 posts by views
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

    // 2. Generate AI Insights via Groq
    let insights = [
      "Keep publishing regularly to increase reader engagement.",
      "Articles with detailed code snippets tend to get more bookmarks.",
      "Your top post has generated over 50% of your total views.",
    ];

    if (totalPosts > 0 && process.env.GROQ_API_KEY) {
      try {
        const statsSummary = `Total Posts: ${totalPosts}, Total Views: ${totalViews}, Total Likes: ${totalLikes}, Total Comments: ${totalComments}. Top Post: "${topPosts[0]?.title || "N/A"}" with ${topPosts[0]?.views || 0} views.`;

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a content analytics AI advisor for bloggers. Given author metrics, provide 3 short, actionable, punchy bullet point insights (under 20 words each). Return ONLY a JSON array of strings: [\"insight 1\", \"insight 2\", \"insight 3\"]",
            },
            { role: "user", content: statsSummary },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        });

        const raw = completion.choices[0]?.message?.content?.trim();
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) insights = parsed;
          else if (parsed.insights && Array.isArray(parsed.insights)) insights = parsed.insights;
        }
      } catch (err) {
        console.warn("AI insights generation warning:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalPosts,
        totalViews,
        totalLikes,
        totalComments,
        avgViewsPerPost,
        avgLikesPerPost,
      },
      topPosts,
      insights,
    });
  } catch (error) {
    console.error("Analytics dashboard error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics dashboard",
    });
  }
};
