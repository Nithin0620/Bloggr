import { Loader } from 'lucide-react';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useProfileStore } from '../store/ProfileStore';

const ProfilePhoto = ({setLiked, user, setProfilePicOpen }) => {
   const [imagePreview, setImagePreview] = useState(null);

   const {updateProfilePic,deleteProfilePic} = useProfileStore();
   const inputRef = useRef();

   const [loading,setLoading] = useState(false);

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
         const reader = new FileReader();
         reader.onloadend = () => {
         setImagePreview(reader.result);
         };
         reader.readAsDataURL(file);
      } else {
         toast.error("Please select a valid image file!");
      }
   };

   const handleProfileUpload = async() => {
      if (!imagePreview) {
         toast.error("Please select a photo to upload!");
         return;
      }
      
      const file = inputRef.current.files[0];
      const formData = new FormData();
      formData.append("image", file);
      setLoading(true);
      const success = await updateProfilePic(formData);
      setLiked(true);

      setLoading(false);
      setTimeout(()=>{setProfilePicOpen(false)},1000);
      // setImagePreview(null);
   };

   const deleteProfilePhoto = async() => {
      setLoading(true);
      const success = await deleteProfilePic(imagePreview);
      setLiked(true);
      setLoading(false);
      setTimeout(()=>{setProfilePicOpen(false)},1000);
      // setImagePreview(null);
   };

   return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex justify-center items-center p-4">
         <div className="relative w-full max-w-md accent-bg-mode accent-text-mode rounded-2xl p-6 shadow-accent-box">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold accent-text">Update Profile Photo</h2>
            <button
               className="text-2xl text-red-500 hover:rotate-90 hover:scale-75 transition-all duration-500"
               onClick={() => setProfilePicOpen(false)}
            >
               <IoMdClose />
            </button>
         </div>

         <div className="flex justify-center items-center mb-4">
            <img
               src={imagePreview || user?.profilePic}
               alt="Profile Preview"
               className="w-32 h-32 object-cover rounded-full border-4 border-accent"
            />
         </div>

         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <input
               ref={inputRef}
               onChange={handleImageChange}
               className="hidden"
               type="file"
               accept="image/*"
            />

            <button
               onClick={() => inputRef.current.click()}
               className="flex items-center hover:bg-black hover:bg-opacity-5 justify-center gap-2 px-4 py-2 rounded-md shadow transition-all"
            >
               <FiUpload />
               Select
            </button>

            <button
               onClick={handleProfileUpload}
               className="accent-bg hover:scale-95 transition-all duration-300 text-white px-4 py-2 rounded-md shadow"
            >
               {
                  loading ? <Loader  className='h-4 w-4 animate-spin'/> : "Upload"
               }
            </button>
         </div>

         <div className="flex justify-center">
            <button
               onClick={deleteProfilePhoto}
               className="text-red-600 hover:text-red-800 underline text-sm"
            >
               {
                  loading ? <Loader className='h-4 w-4 animate-spin'/> : "Delete"
               }
            </button>
         </div>
         </div>
      </div>
   );
};

export default ProfilePhoto;
