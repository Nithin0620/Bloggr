const { askRagChat } = require("../services/ragService");
const ChatHistory = require("../models/chatHistory");

exports.ask = async (req, res) => {
  try {
    const { question, sessionId } = req.body;
    const userId = req.user._id;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question string is required",
      });
    }

    let chat = null;
    let sessionIndex = -1;

    if (sessionId) {
      chat = await ChatHistory.findOne({ user: userId });
      if (chat) {
        sessionIndex = chat.sessions.findIndex(
          (s) => s._id.toString() === sessionId
        );
      }
    }

    if (!chat) {
      chat = new ChatHistory({ user: userId, sessions: [{ title: question.substring(0, 60) }] });
      sessionIndex = 0;
    }

    if (sessionIndex < 0) {
      chat.sessions.push({ title: question.substring(0, 60) });
      sessionIndex = chat.sessions.length - 1;
    }

    const session = chat.sessions[sessionIndex];

    const history = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const { answer, citations } = await askRagChat({ question, history });

    session.messages.push({ role: "user", content: question.trim() });
    session.messages.push({ role: "assistant", content: answer, citations });
    await chat.save();

    return res.status(200).json({
      success: true,
      answer,
      citations,
      sessionId: session._id.toString(),
    });
  } catch (error) {
    console.error("RAG chat error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to process RAG chat request",
    });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ user: req.user._id }).select("sessions._id sessions.title sessions.createdAt");
    if (!chat) {
      return res.status(200).json({ success: true, sessions: [] });
    }
    return res.status(200).json({ success: true, sessions: chat.sessions });
  } catch (error) {
    console.error("Get sessions error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch sessions" });
  }
};

exports.getSessionHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chat = await ChatHistory.findOne({ user: req.user._id });
    if (!chat) {
      return res.status(404).json({ success: false, message: "No chat history found" });
    }
    const session = chat.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    return res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("Get session history error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch session history" });
  }
};
