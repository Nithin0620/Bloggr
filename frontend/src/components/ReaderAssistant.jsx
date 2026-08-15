import React, { useState } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import { MessageSquare, Send, Sparkles, Loader, X, Bot, User, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

const ReaderAssistant = ({ articleId, articleTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm your AI assistant for "${articleTitle}". Ask me anything about this article, or pick a quick option below!`,
    },
  ]);

  const handleAsk = async (textToAsk) => {
    const q = textToAsk || question;
    if (!q || !q.trim()) return;

    const userMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToAsk) setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/reader/ask`,
        { articleId, question: q },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.answer },
        ]);
      } else {
        toast.error("Could not fetch answer");
      }
    } catch (error) {
      console.error("Reader assistant API error:", error);
      toast.error("Error communicating with AI assistant");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = async (type, label) => {
    const userMsg = { role: "user", content: `Generate summary (${label})` };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/reader/summarize`,
        { articleId, type },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.summary },
        ]);
      }
    } catch (error) {
      console.error("Preset summary error:", error);
      toast.error("Failed to generate preset summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span>Ask AI about Article</span>
        </button>
      )}

      {/* Floating Drawer / Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[32rem] rounded-2xl accent-bg-mode border accent-border shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="p-3.5 accent-bg-light border-b accent-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold accent-text">
              <Bot className="w-5 h-5 text-purple-500" />
              <span>AI Reader Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-500/10 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Actions */}
          <div className="p-2 accent-bg-light/50 border-b accent-border flex gap-1.5 overflow-x-auto text-[11px] custom-scroll">
            <button
              onClick={() => handlePreset("bullet", "Key Takeaways")}
              className="px-2.5 py-1 rounded-md border accent-border accent-bg-mode hover:accent-bg-light whitespace-nowrap accent-text"
            >
              📌 Takeaways
            </button>
            <button
              onClick={() => handlePreset("eli5", "Explain like I'm 12")}
              className="px-2.5 py-1 rounded-md border accent-border accent-bg-mode hover:accent-bg-light whitespace-nowrap accent-text"
            >
              🐣 ELI5
            </button>
            <button
              onClick={() => handlePreset("oneliner", "One-liner")}
              className="px-2.5 py-1 rounded-md border accent-border accent-bg-mode hover:accent-bg-light whitespace-nowrap accent-text"
            >
              ⚡ One-liner
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs custom-scroll">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "accent-bg-light border accent-border accent-text-mode rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
                <Loader className="w-3.5 h-3.5 animate-spin text-purple-500" />
                <span>AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-2.5 border-t accent-border accent-bg-mode flex items-center gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask a question about this post..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs outline-none accent-text-mode placeholder-gray-500"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !question.trim()}
              className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReaderAssistant;
