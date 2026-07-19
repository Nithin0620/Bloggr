import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useReadingListStore } from "../store/ReadingListStore";
import { Loader, Plus, Check } from "lucide-react";
import toast from "react-hot-toast";

const AddToReadingListModal = ({ isOpen, onClose, postId }) => {
  const { lists, fetchMyLists, addPostToList, createList } = useReadingListStore();
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMyLists();
    }
  }, [isOpen]);

  const handleAdd = async (listId) => {
    setLoading(true);
    await addPostToList(listId, postId);
    setLoading(false);
  };

  const handleCreateAndAdd = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const list = await createList(newName);
    if (list) {
      await addPostToList(list._id, postId);
      setShowCreate(false);
      setNewName("");
    }
    setCreating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center px-2">
      <div className="accent-bg-mode rounded-2xl shadow-accent-box max-w-md w-full p-4 relative max-h-[70vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold accent-text">Add to Reading List</h2>
          <button
            onClick={onClose}
            className="text-2xl text-red-500 hover:rotate-90 transition-all duration-300"
          >
            <IoMdClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {lists.map((list) => {
            const alreadyAdded = list.posts?.some((p) => p._id === postId || p === postId);
            return (
              <div
                key={list._id}
                className="flex items-center justify-between p-3 rounded-lg border accent-border hover:accent-bg-light transition cursor-pointer"
                onClick={() => !alreadyAdded && handleAdd(list._id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium accent-text truncate">{list.name}</p>
                  <p className="text-xs accent-text-mode opacity-70">
                    {list.posts?.length || 0} posts
                  </p>
                </div>
                {alreadyAdded ? (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : loading ? (
                  <Loader className="animate-spin w-4 h-4 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 accent-text-mode opacity-70 flex-shrink-0" />
                )}
              </div>
            );
          })}

          {lists.length === 0 && !showCreate && (
            <p className="text-center accent-text-mode opacity-70 py-6 text-sm">
              No reading lists yet. Create one below.
            </p>
          )}
        </div>

        {showCreate ? (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="List name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg accent-border accent-bg-mode accent-text-mode text-sm"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
            />
            <button
              onClick={handleCreateAndAdd}
              disabled={creating || !newName.trim()}
              className="px-3 py-2 rounded-lg accent-bg text-white text-sm font-medium disabled:opacity-50"
            >
              {creating ? <Loader className="animate-spin w-4 h-4" /> : "Add"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 border accent-border rounded-lg text-sm font-medium hover:accent-bg-light transition"
          >
            <Plus className="w-4 h-4" />
            Create New List
          </button>
        )}
      </div>
    </div>
  );
};

export default AddToReadingListModal;
