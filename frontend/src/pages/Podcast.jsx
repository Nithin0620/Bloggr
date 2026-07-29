import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Mic, Loader, Sparkles, Bot, User, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

const Podcast = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!articleId) {
      toast.error("No article ID provided");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/podcast/generate`,
        { articleId },
        { withCredentials: true }
      );
      if (response.data.success && response.data.podcast) {
        setPodcast(response.data.podcast);
        toast.success("Podcast generated!");
      }
    } catch (error) {
      console.error("Podcast error:", error);
      toast.error("Failed to generate podcast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-8 flex flex-col items-center accent-bg-mode accent-text-mode">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b accent-border">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:accent-bg-light transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold accent-text">AI Podcast Studio</h1>
            <p className="text-xs opacity-70">Generate and listen to AI-powered podcast conversations</p>
          </div>
        </div>

        {!podcast && !loading && (
          <div className="p-8 rounded-2xl border accent-border accent-bg-mode text-center space-y-4 shadow-sm">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-purple-500/10">
                <Mic className="w-10 h-10 text-purple-500" />
              </div>
            </div>
            <h2 className="text-lg font-semibold accent-text">Ready to generate a podcast</h2>
            <p className="text-sm opacity-70 max-w-md mx-auto">
              Convert this article into a natural two-person conversation between a Host and a Guest expert, powered by AI.
            </p>
            <button
              onClick={handleGenerate}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl flex items-center gap-2 mx-auto transition-all shadow-md"
            >
              <Sparkles className="w-5 h-5" />
              Generate Podcast
            </button>
          </div>
        )}

        {loading && (
          <div className="p-12 rounded-2xl border accent-border accent-bg-mode text-center space-y-4">
            <Loader className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
            <p className="text-sm opacity-70">Generating your AI podcast conversation...</p>
          </div>
        )}

        {podcast && (
          <div className="rounded-2xl border accent-border accent-bg-mode overflow-hidden shadow-sm">
            <div className="p-4 bg-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5" />
                <div>
                  <h4 className="text-sm font-bold">{podcast.title || "AI Podcast Episode"}</h4>
                  <p className="text-xs opacity-80">{podcast.script?.length || 0} turns · ~{Math.round((podcast.duration || 0) / 60)} min</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 text-sm accent-text-mode max-h-[60vh] overflow-y-auto custom-scroll">
              {podcast.script && podcast.script.map((turn, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border accent-border space-y-1 ${
                    turn.speaker === "Host"
                      ? "bg-purple-500/5 border-purple-500/20"
                      : "accent-bg-light"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs">
                    {turn.speaker === "Host" ? (
                      <span className="text-purple-500 flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" /> Host (Alex)
                      </span>
                    ) : (
                      <span className="text-blue-500 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Guest Expert (Sam)
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed opacity-90">{turn.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {podcast && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl flex items-center gap-2 mx-auto transition-all"
          >
            {loading ? (
              <><Loader className="w-4 h-4 animate-spin" /> Regenerating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Regenerate Podcast</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Podcast;
