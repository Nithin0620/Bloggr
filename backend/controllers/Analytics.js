const { getAuthorStats, generateInsights } = require("../services/analyticsAggregator");
const Insight = require("../models/insight");

exports.getAuthorDashboard = async (req, res) => {
  try {
    const authorId = req.user.user._id;

    const stats = await getAuthorStats(authorId);

    const statsSummary = `Total Posts: ${stats.totalPosts}, Total Views: ${stats.totalViews}, Total Likes: ${stats.totalLikes}, Total Comments: ${stats.totalComments}. Top Post: "${stats.topPosts[0]?.title || "N/A"}" with ${stats.topPosts[0]?.views || 0} views.`;
    const insights = await generateInsights(statsSummary);

    return res.status(200).json({
      success: true,
      stats: {
        totalPosts: stats.totalPosts,
        totalViews: stats.totalViews,
        totalLikes: stats.totalLikes,
        totalComments: stats.totalComments,
        avgViewsPerPost: stats.avgViewsPerPost,
        avgLikesPerPost: stats.avgLikesPerPost,
      },
      topPosts: stats.topPosts,
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

exports.getAIInsights = async (req, res) => {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const insight = await Insight.findOne({
      user: req.user.user._id,
      weekStart,
    });

    if (!insight) {
      return res.status(200).json({
        success: true,
        insights: [],
        message: "No insights generated yet for this week",
      });
    }

    return res.status(200).json({
      success: true,
      insights: insight.insights,
    });
  } catch (error) {
    console.error("Get AI insights error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI insights",
    });
  }
};
