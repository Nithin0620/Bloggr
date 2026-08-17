const mongoose = require("mongoose");

const citationSchema = new mongoose.Schema({
  articleId: { type: String },
  articleTitle: String,
  chunkText: String,
  score: Number,
}, { _id: false });

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  citations: [citationSchema],
  createdAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  title: { type: String, default: "New Chat" },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessions: [sessionSchema],
}, { timestamps: true });

chatHistorySchema.index({ user: 1 });

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
