import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReadingListStore } from "../store/ReadingListStore";
import HomePostCards from "../components/HomePostCards";
import { Loader, ArrowLeft, BookOpen } from "lucide-react";

const ReadingListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentList, loading, fetchListById, removePostFromList } = useReadingListStore();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchListById(id);
  }, [id]);

  const handleRemovePost = async (postId) => {
    await removePostFromList(id, postId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin accent-text" />
      </div>
    );
  }

  if (!currentList) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="accent-text-mode">Reading list not found</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center custom-scroll p-2 transition-colors duration-300 accent-bg-mode accent-text-mode min-h-screen">
      <div className="w-[85%] lg:w-[75%] rounded-3xl flex flex-col items-center lg:px-12 px-4 py-6 shadow-accent-box border accent-border transition-colors duration-300 accent-bg-mode accent-text-mode">
        {/* Header */}
        <div className="w-full mb-6">
          <button
            onClick={() => navigate("/readinglists")}
            className="flex items-center gap-1 text-sm accent-text hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to lists
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl accent-bg accent-text">
              <BookOpen className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold accent-text">{currentList.name}</h1>
              {currentList.description && (
                <p className="text-sm accent-text-mode opacity-70">{currentList.description}</p>
              )}
              <p className="text-xs accent-text-mode opacity-70 mt-1">
                {currentList.posts?.length || 0} posts
              </p>
            </div>
          </div>
        </div>

        {/* Posts */}
        {currentList.posts && currentList.posts.length > 0 ? (
          <div className="w-full space-y-4">
            {currentList.posts.map((post) => (
              <div key={post._id} className="relative">
                <HomePostCards post={post} setLiked={setLiked} />
                <button
                  onClick={() => handleRemovePost(post._id)}
                  className="absolute top-3 right-3 text-xs text-red-500 accent-bg px-2 py-1 rounded-md shadow hover:opacity-80 transition z-10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 accent-text-mode">
            <BookOpen className="text-5xl opacity-40 mb-4" />
            <p className="text-lg font-medium accent-text-mode">This list is empty</p>
            <p className="text-sm accent-text-mode mt-1 opacity-70">
              Add posts from the home feed to build your reading list
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingListDetail;
