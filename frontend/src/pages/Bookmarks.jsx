import React, { useEffect, useState } from "react";
import { useBookmarkStore } from "../store/BookmarkStore";
import HomePostCards from "../components/HomePostCards";
import { Loader } from "lucide-react";
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Bookmarks = () => {
  const { bookmarks, loading, fetchBookmarks } = useBookmarkStore();
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await fetchBookmarks();
      setPosts(data);
    };
    load();
  }, [liked]);

  return (
    <div className="flex justify-center custom-scroll p-2 transition-colors duration-300 accent-bg-mode accent-text-mode min-h-screen">
      <div className="w-[85%] lg:w-[75%] rounded-3xl flex flex-col items-center lg:px-12 px-4 py-6 shadow-accent-box border accent-border transition-colors duration-300 accent-bg-mode accent-text-mode">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl accent-bg accent-text">
              <FaBookmark className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold accent-text">Your Bookmarks</h1>
              <p className="text-xs text-gray-400">
                {posts.length} saved {posts.length === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>
          {posts.length > 0 && (
            <button
              onClick={() => navigate("/")}
              className="text-xs accent-text hover:underline font-medium"
            >
              Browse more posts →
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="animate-spin accent-text" />
            <p className="text-sm text-gray-400">Loading your bookmarks...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <FaBookmark className="text-5xl opacity-40" />
            </div>
            <p className="text-lg font-medium text-gray-500">No bookmarks yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Save posts you want to read later by tapping the bookmark icon
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-full accent-bg accent-text text-sm font-medium hover:opacity-90 transition"
            >
              Explore Posts
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {posts.map((post, index) => (
              <HomePostCards key={post._id || index} post={post} setLiked={setLiked} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
