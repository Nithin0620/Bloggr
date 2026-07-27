import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, Eye, Heart, MessageSquare, FileText, Sparkles, TrendingUp, Award, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

const Analytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/analytics/dashboard`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center accent-bg-mode">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const { stats, topPosts, insights } = data || {};

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-8 flex flex-col items-center accent-bg-mode accent-text-mode">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b accent-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold accent-text">Author Analytics Dashboard</h1>
              <p className="text-xs opacity-70">Track performance metrics and AI content insights</p>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border accent-border accent-bg-mode shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-500" /> Total Posts
            </span>
            <p className="text-2xl font-extrabold accent-text">{stats?.totalPosts || 0}</p>
          </div>

          <div className="p-4 rounded-2xl border accent-border accent-bg-mode shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-green-500" /> Total Views
            </span>
            <p className="text-2xl font-extrabold accent-text">{stats?.totalViews || 0}</p>
          </div>

          <div className="p-4 rounded-2xl border accent-border accent-bg-mode shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-500" /> Total Likes
            </span>
            <p className="text-2xl font-extrabold accent-text">{stats?.totalLikes || 0}</p>
          </div>

          <div className="p-4 rounded-2xl border accent-border accent-bg-mode shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> Comments
            </span>
            <p className="text-2xl font-extrabold accent-text">{stats?.totalComments || 0}</p>
          </div>
        </div>

        {/* AI Content Insights Box */}
        {insights && insights.length > 0 && (
          <div className="p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="font-bold text-base accent-text">AI Performance Advisor</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {insights.map((insight, idx) => (
                <div key={idx} className="p-3 rounded-xl accent-bg-mode border accent-border text-xs leading-relaxed accent-text-mode shadow-sm flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Posts Section */}
        <div className="p-5 rounded-2xl border accent-border accent-bg-mode space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base accent-text">Top Performing Articles</h2>
          </div>

          <div className="space-y-2">
            {topPosts && topPosts.length > 0 ? (
              topPosts.map((post, idx) => (
                <div
                  key={post._id}
                  onClick={() => navigate(`/readmore/${post._id}`)}
                  className="p-3.5 rounded-xl border accent-border accent-bg-light hover:opacity-90 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold accent-text line-clamp-1">{post.title}</h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs opacity-75">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-green-500" /> {post.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500" /> {post.likesCount}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs opacity-60">No articles published yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
