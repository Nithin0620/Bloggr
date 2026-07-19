import React, { useEffect, useState } from "react";
import { useBookmarkStore } from "../store/BookmarkStore";
import HomePostCards from "../components/HomePostCards";
import { Loader } from "lucide-react";
import { FaBookmark } from "react-icons/fa";

const Bookmarks = () => {
  const { bookmarks, loading, fetchBookmarks } = useBookmarkStore();
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState(false);

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
        <div className="flex items-center gap-3 mb-6 self-start">
          <FaBookmark className="text-xl accent-text" />
          <h1 className="text-2xl font-bold accent-text">Your Bookmarks</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FaBookmark className="text-4xl mb-4" />
            <p>No bookmarks yet. Save posts to read later!</p>
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
