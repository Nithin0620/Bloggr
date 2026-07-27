const Post = require("../models/post");
const Groq = require("groq-sdk");
const { stripHtml } = require("../services/chunker");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.generatePodcast = async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({ success: false, message: "articleId is required" });
    }

    const post = await Post.findById(articleId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    const plainText = stripHtml(post.content).substring(0, 4000);

    const prompt = `You are a podcast producer. Convert the following article into an engaging 2-person dialogue script between a Host (Alex) and a Guest Expert (Sam).

ARTICLE TITLE: "${post.title}"
ARTICLE CONTENT:
${plainText}

Generate a natural, conversational, 6-8 turn podcast discussion discussing the main points from the article.

Return ONLY a JSON object with this structure:
{
  "title": "Podcast: ${post.title}",
  "script": [
    { "speaker": "Host", "text": "Welcome to today's episode! Today we are discussing..." },
    { "speaker": "Guest", "text": "Thanks for having me, Alex! This is a fascinating topic..." }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    if (!responseText) {
      return res.status(500).json({ success: false, message: "Failed to generate script" });
    }

    const podcastData = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      podcast: podcastData,
    });
  } catch (error) {
    console.error("Podcast generation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI podcast script",
    });
  }
};
