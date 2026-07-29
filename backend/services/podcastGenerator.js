const { generateConversation } = require("./conversationGenerator");
const { synthesizeSpeech } = require("./ttsService");
const logger = require("../configuration/logger");

const SPEAKER_LABELS = {
  Host: "Alex (Host)",
  Guest: "Sam (Guest Expert)",
};

async function generatePodcast({ title, content, summary }) {
  logger.info(`[Podcast Generator] Starting podcast generation for "${title}"`);

  const script = await generateConversation({ title, content, summary });
  if (!script || script.length === 0) {
    logger.warn("[Podcast Generator] No conversation generated");
    return { script: [], audioUrl: null, duration: 0 };
  }

  const fullText = script.map((t) => `${SPEAKER_LABELS[t.speaker] || t.speaker}: ${t.text}`).join("\n\n");
  const audioContent = await synthesizeSpeech(fullText);

  const estimatedDuration = script.reduce((acc, t) => {
    const wordCount = (t.text || "").split(/\s+/).length;
    return acc + Math.ceil(wordCount / 150) * 60;
  }, 0);

  logger.info(`[Podcast Generator] Generated ${script.length} turns, ~${Math.round(estimatedDuration / 60)} min`);

  return {
    script,
    audioUrl: audioContent ? `data:audio/mp3;base64,${audioContent}` : null,
    duration: estimatedDuration,
  };
}

module.exports = { generatePodcast };
