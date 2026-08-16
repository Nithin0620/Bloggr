import React from "react";
import { Eye, Heart } from "lucide-react";


const EngagementChart = ({ topPosts }) => {
  if (!topPosts || topPosts.length === 0) return null;

  const maxViews = Math.max(...topPosts.map((p) => p.views || 0), 1);

  return (
    <div className="p-5 rounded-2xl border accent-border accent-bg-mode space-y-4 shadow-sm">
      <h3 className="font-bold text-sm accent-text">Post Engagement Overview</h3>
      <div className="space-y-3">
        {topPosts.map((post, idx) => {
          const barWidth = Math.max(8, ((post.views || 0) / maxViews) * 100);
          return (
            <div key={post._id || idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="accent-text font-medium line-clamp-1 pr-2">
                  #{idx + 1} {post.title}
                </span>
                <span className="opacity-60 shrink-0 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {post.views || 0}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full accent-bg-light overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-700"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="flex gap-3 text-[10px] opacity-60">
                <span className="flex items-center gap-0.5">
                  <Heart className="w-2.5 h-2.5 text-red-400" /> {post.likesCount || 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EngagementChart;
