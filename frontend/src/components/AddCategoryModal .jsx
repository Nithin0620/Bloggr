import React, { useState } from "react";
import { IoMdClose } from "react-icons/io"; // Optional: You can use ✕ instead if you don't want to install icons
import { usePostStore } from "../store/PostStore";
import { Loader } from "lucide-react";

const AddCategoryModal = ({ isOpen, setAddCategoryOpen,setCategoryCreated }) => {
  const [categoryName, setCategoryName] = useState("");
  const {createCategory} = usePostStore();

  const [loading,setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(categoryName)
    if (!categoryName.trim()) return;
    
    setLoading(true);
    const success = await createCategory(categoryName);
    setCategoryCreated(true);
    setLoading(false);

    setCategoryName("");
    setAddCategoryOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 back flex items-center justify-center z-50">
      <div className=" accent-bg-mode rounded-2xl shadow-accent-box w-full max-w-sm p-6 relative">
        <button
            className="absolute hover:rotate-90 hover:scale-75 transition-all duration-500 top-4 right-4 text-2xl text-red-500"
            onClick={() => setAddCategoryOpen(false)}
         >
            <IoMdClose />
         </button>

        <h2 className="text-lg font-semibold text-center mb-4 accent-text">
          Add New Category
        </h2>

        <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col gap-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category name"
            className="px-4 py-2 border accent-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
          />
          <button
            type="submit"
            className="bg-[var(--accent)] flex items-center justify-center text-white py-2 rounded-xl text-sm hover:bg-[var(--accent-bg-dark)] transition duration-300"
          >
            { loading ? <Loader className="h-6 w-6 animate-spin"/> : <p> Add Category</p> }
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
