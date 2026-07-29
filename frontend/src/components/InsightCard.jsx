import React from "react";
import { TrendingUp } from "lucide-react";

const InsightCard = ({ insight }) => {
  return (
    <div className="p-3 rounded-xl accent-bg-mode border accent-border text-xs leading-relaxed accent-text-mode shadow-sm flex items-start gap-2">
      <TrendingUp className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
      <span>{insight}</span>
    </div>
  );
};

export default InsightCard;
