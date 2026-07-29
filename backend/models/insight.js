const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  insights: [String],
  weekStart: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

insightSchema.index({ user: 1, weekStart: -1 });

module.exports = mongoose.model("Insight", insightSchema);
