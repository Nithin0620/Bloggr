const { semanticSearch } = require("../services/searchService");

exports.semanticSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query string 'q' is required",
      });
    }

    const results = await semanticSearch(q.trim());

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error in semantic search:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to perform semantic search",
    });
  }
};
