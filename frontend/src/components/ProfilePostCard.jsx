import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAuthStore } from "../store/AuthStore";

const ProfilePostCard = ({ post }) => {
  const { authUser } = useAuthStore();

  return (
    <div className="flex bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden w-full max-w-[55rem] h-44 mx-auto my-4 transition-transform hover:scale-[1.01]">
      {/* Image Section */}
      <div className="w-1/3 min-w-[100px] flex items-center justify-center p-4 bg-gray-50">
        <img
          src={post.image}
          alt="Post"
          className="rounded-lg object-cover w-20 h-20 shadow-sm"
        />
      </div>

      {/* Content Section */}
      <div className="w-2/3 p-4 flex flex-col justify-between">
        {/* Categories */}
        <div className="flex items-center gap-2 text-[0.7rem] text-gray-500 font-medium flex-wrap">
          {post.categories.map((category, index) => (
            <span key={index} className="uppercase tracking-wide">
              {category}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-[1.1rem] font-semibold text-gray-800 mt-1">
          {post.title.length <= 50
            ? post.title
            : post.title.substring(0, 50) + "..."}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {post.description.length <= 100
            ? post.description
            : post.description.substring(0, 100) + "..."}
        </p>

        {/* Bottom Section */}
        <div className="mt-3 flex items-center justify-between">
          <button className="text-sm text-blue-500 hover:underline font-medium">
            Read More →
          </button>

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              {post.likes.length}
              <FaRegHeart />
            </span>
            <span className="flex items-center gap-1">
              {post.comments.length}
              <FaRegCommentDots />
            </span>
            <span className="flex items-center gap-1">
              {Math.floor(Math.random() * 10)}
              <IoIosStats />
            </span>

            {post.author._id === authUser._id && (
              <div className="flex items-center gap-3 text-[1rem] ml-2">
                <button className="hover:text-gray-700 transition">
                  <GoPencil />
                </button>
                <button className="hover:text-red-600 transition">
                  <RiDeleteBin6Line />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePostCard;
