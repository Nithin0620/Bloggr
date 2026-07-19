import React, { useEffect, useState } from "react";
import { useReadingListStore } from "../store/ReadingListStore";
import { useNavigate } from "react-router-dom";
import { Loader, Plus, Trash2, BookOpen } from "lucide-react";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";

const ReadingLists = () => {
  const { lists, loading, fetchMyLists, createList, deleteList } = useReadingListStore();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyLists();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("List name is required");
      return;
    }
    setCreating(true);
    const result = await createList(name, description);
    if (result) {
      setShowCreate(false);
      setName("");
      setDescription("");
    }
    setCreating(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this reading list?")) {
      await deleteList(id);
    }
  };

  return (
    <div className="flex justify-center custom-scroll p-2 transition-colors duration-300 accent-bg-mode accent-text-mode min-h-screen">
      <div className="w-[85%] lg:w-[75%] rounded-3xl flex flex-col items-center lg:px-12 px-4 py-6 shadow-accent-box border accent-border transition-colors duration-300 accent-bg-mode accent-text-mode">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl accent-bg accent-text">
              <BookOpen className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold accent-text">Reading Lists</h1>
              <p className="text-xs text-gray-400">
                {lists.length} {lists.length === 1 ? "list" : "lists"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 text-sm font-medium accent-bg accent-text px-3 py-1.5 rounded-lg hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            New List
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="animate-spin accent-text" />
            <p className="text-sm text-gray-400">Loading your lists...</p>
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <BookOpen className="text-5xl opacity-40" />
            </div>
            <p className="text-lg font-medium text-gray-500">No reading lists yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Create lists to organize posts you want to read later
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-full accent-bg accent-text text-sm font-medium hover:opacity-90 transition"
            >
              Create Your First List
            </button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lists.map((list) => (
              <div
                key={list._id}
                onClick={() => navigate(`/readinglist/${list._id}`)}
                className="p-4 rounded-xl border accent-border hover:scale-[1.01] transition-all duration-200 cursor-pointer group accent-bg-mode"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold accent-text truncate">{list.name}</h3>
                    {list.description && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{list.description}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(list._id, e)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {list.posts?.length || 0} {(list.posts?.length || 0) === 1 ? "post" : "posts"}
                  </span>
                </div>
                {list.posts && list.posts.length > 0 && (
                  <div className="mt-3 flex -space-x-2">
                    {list.posts.slice(0, 3).map((post, i) => (
                      <img
                        key={i}
                        src={post.image}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover border-2 border-white dark:border-gray-900"
                      />
                    ))}
                    {list.posts.length > 3 && (
                      <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-900">
                        +{list.posts.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center px-2">
          <div className="accent-bg-mode rounded-2xl shadow-accent-box max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 text-2xl text-red-500 hover:rotate-90 transition-all duration-300"
            >
              <IoMdClose />
            </button>
            <h2 className="text-xl font-semibold accent-text mb-4">New Reading List</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="List name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg accent-border accent-bg-mode accent-text-mode text-sm"
                autoFocus
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg accent-border accent-bg-mode accent-text-mode text-sm resize-none"
              />
              <button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="w-full py-2.5 rounded-lg font-semibold accent-bg text-white hover:opacity-90 transition disabled:opacity-50"
              >
                {creating ? <Loader className="animate-spin mx-auto" /> : "Create List"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingLists;
