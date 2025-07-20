import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { usePostStore } from "../store/PostStore";
import { useAuthStore } from "../store/AuthStore";
import { usePageStore } from "../store/PageStore";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";

const CreatePostHandler = () => {
   const {isCreatePostOpen, setIsCreatePostOpen,setCurrentPage} = usePageStore();
  const { categoriesList, createPost } = usePostStore();
  const { authUser } = useAuthStore();
  const { register, handleSubmit, reset ,setValue} = useForm();
  const [selectedCategories, setSelectedCategories] = useState([]);
   const [previewURL,setPreviewUrl] = useState(null)

  const navigate = useNavigate();

  const imageref = useRef()

   const onSubmit = (data) => {
      const postData = {
         ...data,
         author: authUser._id,
         categories: selectedCategories,
      };

      createPost(postData);
      reset();
      setSelectedCategories([]);
      setIsCreatePostOpen(false);
   };

   const handleCategorySelect = (e) => {
      const value = e.target.value;
      if (value && !selectedCategories.includes(value)) {
         setSelectedCategories((prev) => [...prev, value]);
      }
   };
   const handleclose = ()=>{
      setIsCreatePostOpen(false)
      setCurrentPage("home");
      navigate("/")
   }

   const handleRemoveCategory = (id) => {
      setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
   };

   const handleImageClick = () => {
      if (imageref.current) {
         imageref.current.click();
      }
   };
   const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setValue("image", file); // update react-hook-form value
         setPreviewUrl(URL.createObjectURL(file)); // set preview
      }
   }

   const handleImageClose = ()=>{
      setValue("image",null);
      setPreviewUrl(null);
   }
   if (!isCreatePostOpen) return null;

   return (
      <div className="fixed  inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] bg-opacity-40">
         <div className="w-1/2 max-h-[75vh] overflow-y-auto rounded-lg p-6 accent-bg-mode shadow-accent-box relative">
         <button
            className="absolute hover:rotate-90 hover:scale-75 transition-all duration-500 top-4 right-4 text-2xl text-red-500"
            onClick={() => handleclose()}
         >
            <IoMdClose />
         </button>

         <h2 className="text-2xl font-semibold mb-4 accent-text">Create a New Post</h2>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
               <label className="accent-text block mb-1">Title</label>
               <input
               type="text"
               {...register("title", { required: true })}
               className="w-full px-4 py-2 border rounded-lg accent-border transition-colors duration-300 accent-bg-mode accent-text-mode"
               placeholder="Post Title"
               />
            </div>

            <div>
               <label  className="accent-text block mb-1">Author</label>
               <input type="text" disabled className="w-full text px-4 py-2 accent-text-mode text-opacity-20 font-normal border rounded-lg accent-border" value={authUser.profile.name} />
            </div>

            <div>
               <label className="accent-text block mb-1 ">Content</label>
               <textarea
               rows={6}
               {...register("content", { required: true })}
               className="w-full px-4 py-2 border rounded-lg transition-colors duration-300 accent-bg-mode accent-text-mode accent-border"
               placeholder="Write your content here..."
               />
            </div>

            <div>
               <label className="accent-text block mb-1">Cover Image</label>
               <div className="border accent-border p-5 rounded-lg">
                  <input
                     type="file"
                     accept="image/*"
                     {...register("image",{ required: true })}
                     ref={imageref}
                     onChange={handleFileChange}
                     className="w-full transition-colors hidden duration-300 accent-bg-mode accent-text-mode px-4 py-2 border rounded-lg accent-border"
                     placeholder="https://example.com/image.jpg"
                  />
                  <div className="w-full transition-colors flex items-center gap-2  duration-300 accent-bg-mode accent-text-mode px-4 py-1 border-b rounded-lg accent-border" onClick={handleImageClick}>
                     <span className="text-red-500 text-base"><FiUpload /></span>select image <span className="opacity-40">(only 1 image allowed)</span>
                  </div>
                  <div className={`relative ${previewURL? "":"hidden"} inline-block mt-3`}>
                     { (
                        <span
                           onClick={handleImageClose}
                           className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full accent-bg-mode text-red-600 font-bold hover:bg-red-50  duration-300 cursor-pointer transition-transform hover:scale-110"
                        >
                           <IoMdClose size={16} />
                        </span>
                     )}

                     { (
                        <img
                           src={previewURL}
                           alt="Selected Preview"
                           className="rounded-lg max-h-64 object-contain border"
                        />
                     )}
                  </div>
               </div>
            </div>

            <div>
               <label className="accent-text block mb-1">Read Time</label>
               <input
               type="text"
               {...register("readTime",{ required: true })}
               className="w-full px-4 py-2 border rounded-lg accent-border"
               placeholder="e.g. Time in mins. (5)"
               />
            </div>

            <div>
               <label className="accent-text block mb-1">Categories</label>
               <select
               onChange={handleCategorySelect}
               className="w-full px-4 py-2 border rounded-lg accent-border"
               defaultValue=""
               >
               <option value="" disabled>Select a category</option>
               {categoriesList?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
               ))}
               </select>

               <div className="flex flex-wrap gap-2 mt-2">
               {selectedCategories.map((catId) => {
                  const cat = categoriesList.find(c => c._id === catId);
                  return (
                     <div key={catId} className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm">
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
               Submit Post
            </button>
         </form>
         </div>
      </div>
   );
};

export default CreatePostHandler;
