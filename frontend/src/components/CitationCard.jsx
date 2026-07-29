import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";

const CitationCard = ({ citation }) => {
  const navigate = useNavigate();

  if (!citation) return null;

  return (
    <div
      onClick={() => navigate(`/readmore/${citation.articleId}`)}
      className="p-2.5 rounded-lg border accent-border accent-bg-mode hover:accent-bg-light cursor-pointer transition-all flex items-start justify-between group"
    >
      <div className="space-y-0.5 pr-2 min-w-0 flex-1">
        <h4 className="text-xs font-semibold group-hover:text-purple-500 transition-colors line-clamp-1 flex items-center gap-1">
          <BookOpen className="w-3 h-3 shrink-0" />
          <span className="truncate">{citation.articleTitle}</span>
          <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h4>
        <p className="text-[11px] opacity-70 line-clamp-1">{citation.chunkText}</p>
      </div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 font-mono shrink-0 ml-2">
        {citation.score}% match
      </span>
    </div>
  );
};

export default CitationCard;
