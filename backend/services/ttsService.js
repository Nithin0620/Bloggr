const logger = require("../configuration/logger");

async function synthesizeSpeech(text) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;

  if (!apiKey) {
    logger.info("[TTS] No GOOGLE_TTS_API_KEY set — skipping audio generation");
    return null;
  }

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: "en-US", name: "en-US-Neural2-J" },
          audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google TTS API error: ${response.status}`);
    }

    const data = await response.json();
    return data.audioContent;
  } catch (error) {
    logger.error(`[TTS] Synthesis failed: ${error.message}`);
    return null;
  }
}

module.exports = { synthesizeSpeech };
