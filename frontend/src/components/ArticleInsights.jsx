import React, { useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, FileText, Search, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

const ArticleInsights = ({ post }) => {
  const [activeTab, setActiveTab] = useState("summaries");
  const [isOpen, setIsOpen] = useState(true);

  if (!post) return null;

  const { grammar, seo, difficulty, summaries } = post;

  // Don't display component if no AI metadata has been generated yet
  if (!grammar && !seo && !difficulty && !summaries) {
    return null;
  }

  const getScoreColor = (score) => {
    if (!score) return "text-gray-400 border-gray-400";
    if (score >= 80) return "text-green-500 border-green-500/30 bg-green-500/10";
    if (score >= 60) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-red-500 border-red-500/30 bg-red-500/10";
  };

  const getDifficultyBadge = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "advanced":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "intermediate":
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="w-full my-6 rounded-2xl border accent-border accent-bg-mode overflow-hidden accent-box-shadow transition-all duration-300">
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer accent-bg-light hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-base accent-text">AI Publishing Insights</h3>
        </div>

        <div className="flex items-center gap-3">
          {difficulty?.level && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${getDifficultyBadge(difficulty.level)}`}>
              {difficulty.level}
            </span>
          )}

          {grammar?.score !== undefined && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getScoreColor(grammar.score)}`}>
              Grammar: {grammar.score}
            </span>
          )}

          {seo?.score !== undefined && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getScoreColor(seo.score)}`}>
              SEO: {seo.score}
            </span>
          )}

          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isOpen && (
        <div className="p-5 border-t accent-border space-y-4">
          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b accent-border pb-3 flex-wrap">
            <button
              onClick={() => setActiveTab("summaries")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === "summaries"
                  ? "bg-purple-600 text-white"
                  : "accent-text-mode hover:accent-bg-light"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Summaries & Key Points
            </button>

            <button
              onClick={() => setActiveTab("seo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === "seo"
                  ? "bg-purple-600 text-white"
                  : "accent-text-mode hover:accent-bg-light"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              SEO & Metadata
            </button>

            <button
              onClick={() => setActiveTab("grammar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === "grammar"
                  ? "bg-purple-600 text-white"
                  : "accent-text-mode hover:accent-bg-light"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Grammar Audit ({grammar?.issues?.length || 0})
            </button>
          </div>

          {/* Tab 1: Summaries */}
          {activeTab === "summaries" && summaries && (
            <div className="space-y-4 text-sm accent-text-mode">
              {summaries.tldr && (
                <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 block mb-1">
                    ⚡ TL;DR
                  </span>
                  <p className="leading-relaxed">{summaries.tldr}</p>
                </div>
              )}

              {summaries.bulletPoints && summaries.bulletPoints.length > 0 && (
                <div>
                  <span className="font-semibold block mb-2 opacity-80">📌 Key Takeaways</span>
                  <ul className="list-disc list-inside space-y-1.5 pl-1 opacity-90">
                    {summaries.bulletPoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {summaries.oneLiner && (
                <div className="italic text-xs opacity-75 border-l-2 border-purple-500 pl-3">
                  "{summaries.oneLiner}"
                </div>
              )}
            </div>
          )}

          {/* Tab 2: SEO */}
          {activeTab === "seo" && seo && (
            <div className="space-y-3 text-sm accent-text-mode">
              {seo.metaTitle && (
                <div>
                  <span className="text-xs font-bold text-gray-400 block">Suggested Meta Title</span>
                  <p className="font-medium">{seo.metaTitle}</p>
                </div>
              )}

              {seo.metaDescription && (
                <div>
                  <span className="text-xs font-bold text-gray-400 block">Meta Description</span>
                  <p className="opacity-90">{seo.metaDescription}</p>
                </div>
              )}

              {seo.keywords && seo.keywords.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Extracted Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {seo.keywords.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs rounded-md accent-bg-light border accent-border">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {seo.issues && seo.issues.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> SEO Optimization Tips
                  </span>
                  <ul className="list-disc list-inside text-xs opacity-80 space-y-1">
                    {seo.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Grammar */}
          {activeTab === "grammar" && grammar && (
            <div className="space-y-3 text-sm accent-text-mode">
              {grammar.issues && grammar.issues.length > 0 ? (
                grammar.issues.map((issue, idx) => (
                  <div key={idx} className="p-3 rounded-xl border accent-border accent-bg-light text-xs space-y-1">
                    <div className="flex justify-between items-center text-gray-400 font-mono">
                      <span>Paragraph {issue.paragraph || 1}</span>
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-gray-500/10">{issue.type || "Grammar"}</span>
                    </div>
                    <p className="line-through text-red-400">{issue.original}</p>
                    <p className="text-emerald-500 font-medium">✓ {issue.suggestion}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs opacity-70 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No grammar or clarity issues detected in this article!</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleInsights;
