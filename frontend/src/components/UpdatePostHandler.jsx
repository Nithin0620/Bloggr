import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { usePostStore } from "../store/PostStore";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import {toast} from "react-hot-toast"

const UpdatePostHandler = ({ post }) => {
   const { isUpdatePostOpen, setIsUpdatePostOpen, categoriesList, updatePost } = usePostStore();
   const { authUser } = useAuthStore();
   const { register, handleSubmit, setValue, reset } = useForm();
   const [selectedCategories, setSelectedCategories] = useState([]);
   const [previewURL, setPreviewUrl] = useState(null);
   const navigate = useNavigate();
   const imageref = useRef();
   // console.log("post",post)

   useEffect(() => {
      if (post) {
         setValue("title", post.title);
         setValue("content", post.content);
         setValue("readTime", post.readTime);
         setValue("image", post.image); // initial value
         setSelectedCategories(post.categories || []);
         setPreviewUrl(post.image); // for initial image preview
      }
   }, [post, setValue]);

   const handleClose = () => {
      setIsUpdatePostOpen(false);
      navigate("/profile");
   };

   const onSubmit = (data) => {
      if(selectedCategories.length ===0) {
         toast.warning("Please select Atleast one Category!")
         return;
      }
      const updatedPost = {
         ...data,
         author: authUser._id,
         categories: selectedCategories,
         _id: post._id,
      };

      updatePost(updatedPost);
      reset();
      setSelectedCategories([]);
      setIsUpdatePostOpen(false);
   };

   const handleCategorySelect = (e) => {
      const value = e.target.value;
      if (value && !selectedCategories.includes(value)) {
         setSelectedCategories((prev) => [...prev, value]);
      }
   };

   const handleRemoveCategory = (id) => {
      setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
   };

   const handleImageClick = () => {
      if (imageref.current) imageref.current.click();
   };

   const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setValue("image", file);
         setPreviewUrl(URL.createObjectURL(file));
      }
   };

   const handleImageClose = () => {
      setValue("image", null);
      setPreviewUrl(null);
   };

   if (!isUpdatePostOpen || !post) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] bg-opacity-40">
         <div className="w-1/2 max-h-[75vh] overflow-y-auto rounded-lg p-6 accent-bg-mode shadow-accent-box relative">
         <button
            className="absolute hover:rotate-90 hover:scale-75 transition-all duration-500 top-4 right-4 text-2xl text-red-500"
            onClick={handleClose}
         >
            <IoMdClose />
         </button>

         <h2 className="text-2xl font-semibold mb-4 accent-text">Update Blog</h2>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
               <label className="accent-text block mb-1">Title</label>
               <input
               type="text"
               {...register("title", { required: true })}
               className="w-full px-4 py-2 border rounded-lg accent-border accent-bg-mode accent-text-mode"
               placeholder="Post Title"
               />
            </div>

            <div>
               <label className="accent-text block mb-1">Author</label>
               <input
               type="text"
               disabled
               value={authUser.profile.name}
               className="w-full text px-4 py-2 accent-text-mode text-opacity-20 font-normal border rounded-lg accent-border"
               />
            </div>

            <div>
               <label className="accent-text block mb-1">Content</label>
               <textarea
               rows={6}
               {...register("content", { required: true })}
               className="w-full px-4 py-2 border rounded-lg accent-bg-mode accent-text-mode accent-border"
               placeholder="Write your content here..."
               />
            </div>

            <div>
               <label className="accent-text block mb-1">Cover Image</label>
               <div className="border accent-border p-5 rounded-lg">
               <input
                  type="file"
                  accept="image/*"
                  {...register("image",{required:true})}
                  ref={imageref}
                  onChange={handleFileChange}
                  className="hidden"
               />
               <div
                  className="w-full flex items-center gap-2 px-4 py-1 border-b rounded-lg accent-border accent-bg-mode accent-text-mode"
                  onClick={handleImageClick}
               >
                  <span className="text-red-500 text-base">
                     <FiUpload />
                  </span>
                  select image <span className="opacity-40">(only 1 image allowed)</span>
               </div>

               {previewURL && (
                  <div className="relative inline-block mt-3">
                     <span
                     onClick={handleImageClose}
                     className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full accent-bg-mode text-red-600 font-bold hover:bg-red-50 cursor-pointer transition-transform hover:scale-110"
                     >
                     <IoMdClose size={16} />
                     </span>
                     <img
                     src={previewURL}
                     alt="Preview"
                     className="rounded-lg max-h-64 object-contain border"
                     />
                  </div>
               )}
               </div>
            </div>

            <div>
               <label className="accent-text block mb-1">Read Time</label>
               <input
               type="text"
               {...register("readTime", { required: true })}
               className="w-full px-4 py-2 border rounded-lg accent-border"
               placeholder="e.g. 5 min read"
               />
            </div>

            <div>
               <label className="accent-text block mb-1">Categories</label>
               <select
               onChange={handleCategorySelect}
               className="w-full px-4 py-2 border rounded-lg accent-border"
               defaultValue=""
               >
               <option value="" disabled>
                  Select a category
               </option>
               {categoriesList?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                     {cat.name}
                  </option>
               ))}
               </select>

               <div className="flex flex-wrap gap-2 mt-2">
               {selectedCategories.map((catId) => {
                  const cat = categoriesList.find((c) => c._id === catId);
                  return (
                     <div
                     key={catId}
                     className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                     >
                     {cat?.name}
                     <button
                        className="ml-2 text-red-600 font-bold"
                        onClick={() => handleRemoveCategory(catId)}
                     >
                        ×
                     </button>
                     </div>
                  );
               })}
               </div>
            </div>

            <button
               type="submit"
               className="accent-bg text-white px-6 py-2 rounded-lg shadow-accent-box"
            >
               Update Post
            </button>
         </form>
         </div>
      </div>
   );
};

export default UpdatePostHandler;
