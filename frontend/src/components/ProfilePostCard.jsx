import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../store/PostStore";
import { usePageStore } from "../store/PageStore";
import {useIntractionStore} from "../store/IntractionStore";

const ProfilePostCard = ({ post,setLiked,setIsDeleteModalOpen,setDeletePostid}) => {
  const {setIsUpdatePostOpen,setUpdatePost} = usePageStore();
  const {LikeUnlikePost,postsLikedByUser} = useIntractionStore();
  const handleUpdatePost = ()=>{
    console.log("in handle updatepist,1",post)
    console.log(post);
    setIsUpdatePostOpen(true);
    setUpdatePost(post);
    console.log("in handle updatepist,2",post)
  }



  const handleDelete = ()=>{
    setIsDeleteModalOpen(true);
    setDeletePostid(post._id);
  }

  

  const navigate = useNavigate();
  
  const { authUser } = useAuthStore();

  const handleReadmoreClick = (postId)=>{
    navigate(`/readmor/${postId}`)
  }

  const handleLike = async () => {
    const response = await LikeUnlikePost(post._id);
   
    setLiked(true);
   
  };

  return (
    <div>
    <div className="flex justify-between pr-2 rounded-2xl shadow-md border accent-border overflow-hidden w-full max-w-[55rem] h-44 mx-auto my-4 hover:scale-[1.01] transition-all duration-200 accent-bg-mode accent-text-mode">
      {/* Image Section */}
      <div className=" min-w-[100px]  flex items-center justify-center left-0 ">
        <img
          src={post.image}
          alt="Post"
          className=" object-cover w-48 h-full accent-border shadow-sm"
        />
      </div>

      {/* Content Section */}
      <div className="w-2/3 p-4 flex flex-col justify-between">
        {/* Categories */}
        <div className="flex items-center gap-2 text-[0.7rem]  font-medium flex-wrap ">
          {post.categories.map((category, index) => (
            <span key={index} className="uppercase tracking-wide border accent-border rounded-lg p-[0.15rem]">
              {category.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-[1.1rem] font-semibold accent-text  mt-1">
          {post.title.length <= 50
            ? post.title
            : post.title.substring(0, 50) + "..."}
        </h2>

        {/* Description */}
        <p className="text-sm mt-1 line-clamp-2">
          {post.content.length <= 100
            ? post.content
            : post.content.substring(0, 100) + "..."}
        </p>

        {/* Bottom Section */}
        <div className="mt-3 flex items-center justify-between">
          <button onClick={()=>handleReadmoreClick(post._id)} className="text-sm text-blue-500 hover:underline font-medium">
            Read More →
          </button>

          <div className="flex items-center gap-4  text-sm">
            <span onClick={()=>handleLike()} className="flex items-center gap-1 transition-all duration-300 hover:text-red-500">
              {post.likes.length }
            {postsLikedByUser.includes(post._id) ? <FaHeart className='text-red-500'/> : <FaRegHeart/> }
            </span>
            <span className="flex items-center gap-1 transition-all duration-300 hover:text-green-500">
              {post.comments.length}
              <FaRegCommentDots />
            </span>
            <span className="flex items-center gap-1 hover:text-blue-500 transition-all duration-300">
              {post.views}
              <IoIosStats />
            </span>

            {post.author._id && (
              <div className="flex items-center gap-3 text-[1rem] ml-2">
                <button onClick={()=>handleUpdatePost()} className="accent-text transition">
                  <GoPencil />
                </button>
                <button onClick={()=>handleDelete()} className="hover:text-red-600 transition duration-200">
                  <RiDeleteBin6Line />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    


    </div>
  );
};

export default ProfilePostCard;
