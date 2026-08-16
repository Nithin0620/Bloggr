import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Send, Bot, User, BookOpen, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CitationCard from "../components/CitationCard";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

const RagChat = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to Bloggr RAG Knowledge Assistant! Ask me any question, and I'll search across all published articles on the platform to formulate an answer with citations.",
      citations: [],
    },
  ]);

  const handleAsk = async (queryText) => {
    const q = queryText || question;
    if (!q || !q.trim()) return;

    const userMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/ragchat/ask`,
        { question: q, sessionId },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.sessionId) setSessionId(response.data.sessionId);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.data.answer,
            citations: response.data.citations || [],
          },
        ]);
      } else {
        toast.error("Failed to fetch response");
      }
    } catch (error) {
      console.error("RAG chat error:", error);
      toast.error("Error communicating with RAG chat assistant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-8 flex flex-col items-center accent-bg-mode accent-text-mode">
      <div className="w-full max-w-4xl flex-1 flex flex-col rounded-3xl border accent-border accent-bg-mode shadow-accent-box overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b accent-border accent-bg-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold accent-text">Platform RAG Knowledge Assistant</h1>
              <p className="text-xs opacity-70">Ask questions sourced from vectors across all published articles</p>
            </div>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scroll">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Bot className="w-4 h-4 text-purple-500" />
                </div>
              )}

              <div className="max-w-[85%] space-y-3">
                <div
                  className={`p-4 rounded-2xl leading-relaxed text-sm ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "accent-bg-light border accent-border accent-text-mode rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="p-3 rounded-xl border accent-border accent-bg-light/60 space-y-2">
                    <span className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Source Citations ({msg.citations.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.citations.map((cite, cIdx) => (
                        <CitationCard key={cIdx} citation={cite} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-400 text-xs py-3">
              <Loader className="w-4 h-4 animate-spin text-purple-500" />
              <span>Searching vector database and compiling response...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t accent-border accent-bg-light">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask anything across all published articles..."
              className="flex-1 bg-transparent px-4 py-3 rounded-xl border accent-border outline-none text-sm accent-text-mode placeholder-gray-500 accent-bg-mode"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !question.trim()}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RagChat;
