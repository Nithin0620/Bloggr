import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import ProfilePostCard from '../components/ProfilePostCard';
import {usePageStore} from "../store/PageStore"
import UpdatePostHandler from "../components/UpdatePostHandler"
import {IoMdClose} from "react-icons/io"
import { useParams } from 'react-router-dom';
import { useProfileStore } from '../store/ProfileStore';
import { Loader } from 'lucide-react';
import {toast} from "react-hot-toast"
import { usePostStore } from '../store/PostStore';

const Profile = () => {
  const authUser = useAuthStore();
  const {isUpdatePostOpen,updatePost} = usePageStore();
  const [isDeleteModalOpen,setIsDeleteModalOpen] = useState();
  const [user,setUser] = useState(null);
  const {deletePost} = usePostStore();
  // console.log("isUpdatePostOpen",isUpdatePostOpen)
  // console.log("updatePost",updatePost)
  const [deletePostid,setDeletePostid] = useState(null);
  const [deleted,setDeleted] = useState(false);

  const [postUpdated,setPostUpdated] =  useState(false);

  const deletePostHandler = async()=>{
    console.log(deletePostid)

    const success = await deletePost(deletePostid);
    if(!success) toast.error("error occured in deleting the post!");
    else{
      setDeletePostid(null);
      setIsDeleteModalOpen(false);
      setDeleted(true);
      setTimeout(()=>{
        setDeleted(false);

      },3000)
    }
  }

  
  const {fetchUserProfile} = useProfileStore();
  const {userId} = useParams();
  const [loading,setLoading] = useState(false);
  
  useEffect(()=>{
    const fetchProfileData = async()=>{
      setLoading(true);
      const response = await fetchUserProfile(userId);
      console.log("response" , response)
      setUser(response.data || []);
      setPosts(response.data.profile.posts);
      setLoading(false);
    }
    fetchProfileData();
    setTimeout(()=>{
      setPostUpdated(false);
    },2000)
  },[deleted,postUpdated])

  const [posts,setPosts] = useState(null);
  
  // console.log(loading)

  if(loading || !user) return(
    <div className='flex items-center mt-40 justify-center'><Loader className='animate-spin'/></div>
  )

  return (
    <div className="flex justify-center mx-auto px-4 py-2 transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="w-[85%] rounded-lg p-8 ">
        {/* Profile Card */}
        <div className=" rounded-xl p-6 flex flex-col md:flex-row items-start justify-between shadow-accent-box accent-border border">
          {/* Left - Image and Basic Info */}
          <div className="flex items-start gap-6 w-full md:w-auto">
            <img
              src={user.profilePic}
              alt="profile"
              className="rounded-full w-24 h-24 md:w-28 md:h-28 object-cover"
            />
            <div>
              <h1 className="text-xl font-semibold accent-text">
                {user.firstName + " " +user.lastName} 
              </h1>
              <p className="text-sm">
                Joined on {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="mt-2 text-sm ">{user.description}</p>
              <button className="mt-4 accent-bg hover:accent-bg-dark text-sm font-medium py-1.5 px-4 rounded-md transition-all duration-150">
                Follow {user.firstName}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-300 mx-6 h-24"></div>

          {/* Followers */}
          <div className="flex md:flex-col items-center gap-6 mt-6 md:mt-0 w-full md:w-auto justify-around">
            <div className="text-center">
              <p className="text-xl font-bold">{user.profile.followers.length}</p>
              <p className="text-sm font-medium ">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{user.profile.following.length}</p>
              <p className="text-sm font-medium ">Following</p>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold accent-underline accent-text pb-3">
            Posts
          </h2>

          <div className='min-w-full h-[0.12rem] accent-bg-light rounded-full'></div>

          <div className="mt-6 space-y-6">
            {posts.map((post, index) => (
              <ProfilePostCard key={index} post={post} setDeletePostid={setDeletePostid} setIsDeleteModalOpen={setIsDeleteModalOpen}/>
            ))}
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[90%] sm:w-[400px] accent-bg-mode p-6 rounded-2xl shadow-accent-box relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-red-500 text-xl hover:rotate-90 hover:scale-75 transition-all duration-500"
            >
              <IoMdClose />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold accent-text mb-3">
              Delete Post
            </h2>

            {/* Description */}
            <p className="accent-text-mode mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border accent-border accent-text-mode transition-all duration-500 hover:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => deletePostHandler()}
                className="px-4 py-2 rounded-lg accent-bg   transition-all duration-200 hover:opacity-80 text-white shadow-accent-box"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )},
      {
        isUpdatePostOpen && 
        <UpdatePostHandler post={updatePost} setPostUpdated={setPostUpdated}/>
      }
    </div>
  );
};

export default Profile;
