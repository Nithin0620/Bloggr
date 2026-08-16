import React, { useState } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import { Mic, Play, Pause, Loader, User, Bot, Volume2, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

const PodcastPlayer = ({ articleId, articleTitle }) => {
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGeneratePodcast = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/podcast/generate`,
        { articleId },
        { withCredentials: true }
      );

      if (response.data.success) {
        setPodcast(response.data.podcast);
        setIsOpen(true);
        toast.success("AI Podcast Script generated!");
      } else {
        toast.error("Failed to generate podcast");
      }
    } catch (error) {
      console.error("Podcast generation error:", error);
      toast.error("Error generating podcast script");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full my-4 rounded-2xl border border-purple-500/30 accent-bg-mode overflow-hidden shadow-sm">
      {!podcast ? (
        <div className="p-4 flex items-center justify-between accent-bg-light">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold accent-text">AI Podcast Generator</h4>
              <p className="text-xs opacity-70">Convert article into a two-person Host & Guest dialogue</p>
            </div>
          </div>

          <button
            onClick={handleGeneratePodcast}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            {loading ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Listen as Podcast
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="p-4 bg-purple-600 text-white flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5" />
              <div>
                <h4 className="text-sm font-bold">{podcast.title || "AI Podcast Episode"}</h4>
                <p className="text-xs opacity-80">{podcast.script?.length || 0} turns Host/Guest Dialogue</p>
              </div>
            </div>

            <button>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Transcript / Dialogue Body */}
          {isOpen && (
            <div className="p-4 space-y-3 text-xs accent-text-mode max-h-80 overflow-y-auto custom-scroll border-t accent-border">
              {podcast.script && podcast.script.map((turn, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border accent-border space-y-1 ${
                    turn.speaker === "Host"
                      ? "bg-purple-500/5 border-purple-500/20"
                      : "accent-bg-light"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                    {turn.speaker === "Host" ? (
                      <span className="text-purple-500 flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Host (Alex)
                      </span>
                    ) : (
                      <span className="text-blue-500 flex items-center gap-1">
                        <User className="w-3 h-3" /> Guest Expert (Sam)
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed opacity-90">{turn.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastPlayer;
