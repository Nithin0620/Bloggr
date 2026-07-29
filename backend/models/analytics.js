const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["view", "like", "bookmark", "comment", "share", "read_progress"],
    required: true,
  },
  value: { type: Number, default: 0 },
  sentiment: {
    type: String,
    enum: ["positive", "neutral", "negative"],
    default: "neutral",
  },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const analyticsSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  events: [eventSchema],
}, { timestamps: true });

analyticsSchema.index({ post: 1, user: 1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
