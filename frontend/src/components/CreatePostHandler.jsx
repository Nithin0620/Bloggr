import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { usePostStore } from "../store/PostStore";
import { useAuthStore } from "../store/AuthStore";
import { usePageStore } from "../store/PageStore";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import {toast} from "react-hot-toast"
import {Loader, Clock, Send, Tag} from "lucide-react"
import RichTextEditor from "./RichTextEditor";
import { useTagStore } from "../store/TagStore";


const CreatePostHandler = () => {
   const {isCreatePostOpen, setIsCreatePostOpen,setCurrentPage} = usePageStore();
  const { createPost,fetchCategories,createPostLoading ,fetchPosts} = usePostStore();
  const { authUser } = useAuthStore();
   const { register, handleSubmit, reset ,setValue} = useForm();
   const [selectedCategories, setSelectedCategories] = useState([]);
    const [previewURL,setPreviewUrl] = useState(null)
    const [editorContent, setEditorContent] = useState("");
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledAt, setScheduledAt] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const { tags: allTags, fetchTags } = useTagStore();

  const navigate = useNavigate();

   const [categories,setCategories] = useState([]);
   
   useEffect(() => {
      const fetchCategoryAndPostfromStore = async()=>{
         const array = await fetchCategories();
         setCategories(array);
      }
      fetchCategoryAndPostfromStore();
      fetchTags();
   }, []);
   

  const imageref = useRef()
  const [loading,setLoading] = useState(false);

   const onSubmit = async(data) => {
      if (selectedCategories.length === 0) {
         toast("Please select atleat one Category")
         return;
      }
      if (!editorContent || editorContent === "<p></p>") {
         toast("Please write some content")
         return;
      }
      if (isScheduled && !scheduledAt) {
         toast("Please select a date and time for scheduling")
         return;
      }
      if (isScheduled && new Date(scheduledAt) <= new Date()) {
         toast("Scheduled time must be in the future")
         return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", editorContent);
      formData.append("readTime", data.readTime);
      formData.append("image", data.image); 
      selectedCategories.forEach((cat) => {
         formData.append("categories", cat); 
      });
      if (isScheduled && scheduledAt) {
         formData.append("scheduledAt", scheduledAt);
      }
      selectedTags.forEach((tag) => {
         formData.append("tags", tag);
      });

      setLoading(true);
      const success = await createPost(formData);
      if(success){
          setLoading(false);
          reset();
          setSelectedCategories([]);
          setEditorContent("");
          setIsScheduled(false);
          setScheduledAt("");
          setIsCreatePostOpen(false);
          fetchPosts();
      } else {
          setLoading(false);
      }
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
         setValue("image", file);
         setPreviewUrl(URL.createObjectURL(file));
      }
   }

   const handleImageClose = ()=>{
      setValue("image",null);
      setPreviewUrl(null);
   }
   if (!isCreatePostOpen) return null;

   return (
      <div className="fixed  inset-0 z-40 flex custom-scroll items-center justify-center backdrop-blur-[1px] bg-opacity-40">
         <div className="md:w-1/2 sm:w-2/3 max-h-[75vh] overflow-y-auto rounded-lg p-6 accent-bg-mode shadow-accent-box relative">
         <button
            className="absolute hover:rotate-90 hover:scale-75 transition-all duration-500 top-4 right-4 text-2xl text-red-500"
            onClick={() => handleclose()}
         >
            <IoMdClose />
         </button>

         <h2 className="text-2xl font-semibold mb-4 accent-text">Create a New Blog</h2>

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
               <input type="text" disabled className="w-full text accent-bg-mode px-4 py-2 accent-text-mode text-opacity-20 font-normal border rounded-lg accent-border" value={authUser?.profile?.name} />
            </div>

            <div>
               <label className="accent-text block mb-1 ">Content</label>
               <RichTextEditor
               content={editorContent}
               onChange={setEditorContent}
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
                  <div className="w-full cursor-pointer hover:scale-[0.99] transition-all  flex items-center gap-2  duration-300 accent-bg-mode accent-text-mode px-4 py-1 border-b rounded-lg accent-border" onClick={handleImageClick}>
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
                  type="number"
                  min="1"
                  step="1"
                  {...register("readTime", { required: true, min: 1 })}
                  className="w-full accent-text-mode accent-bg-mode px-4 py-2 border rounded-lg accent-border no-spinner"
                  placeholder="e.g. Time in mins. (5)"
               />

            </div>

            <div className="accent-text-mode accent-bg-mode">
               <label className="accent-text block mb-1">Categories</label>
               <select
               onChange={handleCategorySelect}
               className="w-full px-4 py-2 border accent-text-mode accent-bg-mode rounded-lg accent-border"
               defaultValue=""
               >
               <option className="accent-text-mode accent-bg-mode" value="" disabled>Select a category</option>
               {categories?.map((cat,index) => (
                  <option className="accent-text-mode accent-bg-mode" key={index} value={cat}>{cat}</option>
               ))}
               </select>

               <div className="flex accent-text-mode accent-bg-mode flex-wrap gap-2 mt-2">
               {selectedCategories.map((catId,index) => {
                  return (
                     <div key={index} className="flex items-center accent-bg-light accent-text-mode accent-bg-mode px-3 py-1 rounded-full text-sm">
                     {catId}
                     <button
                        className="hover:scale-110 transition ml-1.5"
                        onClick={() => handleRemoveCategory(catId)}
                     >
                        <IoMdClose size={14} />
                     </button>
                     </div>
                  );
               })}
               </div>
            </div>

            <div className="w-full h-[1px] accent-border" />

            {/* Tags Section */}
            <div className="accent-text-mode accent-bg-mode">
               <label className="accent-text block mb-1">
                  <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> Tags (optional)</span>
               </label>
               <div className="flex gap-2">
                  <input
                     type="text"
                     value={tagInput}
                     onChange={(e) => setTagInput(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                           e.preventDefault();
                           if (tagInput.trim() && !selectedTags.includes(tagInput.trim().toLowerCase())) {
                              setSelectedTags([...selectedTags, tagInput.trim().toLowerCase()]);
                           }
                           setTagInput("");
                        }
                     }}
                     placeholder="Type a tag and press Enter"
                     className="flex-1 px-4 py-2 border rounded-lg accent-border accent-bg-mode accent-text-mode text-sm"
                  />
               </div>
               <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag, index) => (
                     <div key={index} className="flex items-center accent-bg-light accent-text px-3 py-1 rounded-full text-sm">
                        #{tag}
                        <button
                           onClick={() => setSelectedTags(selectedTags.filter((_, i) => i !== index))}
                           className="ml-1.5 hover:scale-110 transition"
                        >
                           <IoMdClose size={14} />
                        </button>
                     </div>
                  ))}
               </div>
               {allTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                     <span className="text-xs accent-text-mode opacity-70">Popular:</span>
                     {allTags.slice(0, 8).map((tag) => (
                        <button
                           key={tag._id}
                           type="button"
                           onClick={() => {
                              if (!selectedTags.includes(tag.name)) {
                                 setSelectedTags([...selectedTags, tag.name]);
                              }
                           }}
                           className="text-xs px-2 py-0.5 rounded-full border accent-border hover:accent-bg-light transition"
                        >
                           #{tag.name}
                        </button>
                     ))}
                  </div>
               )}
            </div>

            <div className="w-full h-[1px] accent-border" />

            {/* Schedule Section */}
            <div className="accent-text-mode accent-bg-mode">
               <label className="accent-text block mb-2">Publishing</label>
               <div className="flex gap-3">
                  <button
                     type="button"
                     onClick={() => setIsScheduled(false)}
                     className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                        !isScheduled
                           ? "accent-bg accent-text-mode border-transparent shadow-sm"
                           : "accent-border hover:opacity-80"
                     }`}
                  >
                     <Send className="w-4 h-4" />
                     Publish Now
                  </button>
                  <button
                     type="button"
                     onClick={() => setIsScheduled(true)}
                     className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                        isScheduled
                           ? "accent-bg accent-text-mode border-transparent shadow-sm"
                           : "accent-border hover:opacity-80"
                     }`}
                  >
                     <Clock className="w-4 h-4" />
                     Schedule
                  </button>
               </div>
               {isScheduled && (
                  <div className="mt-3">
                     <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-4 py-2 border rounded-lg accent-border accent-bg-mode accent-text-mode text-sm"
                     />
                      <p className="text-xs accent-text-mode opacity-70 mt-1">Post will be published automatically at this time</p>
                  </div>
               )}
            </div>

            <button
               type="submit"
               className="w-full flex justify-center items-center gap-2 accent-bg accent-text-mode px-6 py-2 rounded-lg shadow-accent-box"
               disabled={loading}
               >
               {loading ? (
                  <>
                     <Loader className="animate-spin w-5 h-5" />
                     <span>Creating...</span>
                  </>
               ) : (
                  "Submit Post"
               )}
            </button>
         </form>
         </div>

         
      </div>
   );
};

export default CreatePostHandler;
