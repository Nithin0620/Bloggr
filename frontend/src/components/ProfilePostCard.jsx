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
    <div className="flex bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[55rem] h-44 mx-auto my-4">
      <div className="w-1/3 min-w-[100px] h-auto flex items-center justify-center p-4">
        <img
          src={post.image}
          alt="Post"
          className="rounded-full object-cover w-20 h-20"
        />
      </div>

      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
          {post.categories.map((category, index) => (
            <span key={index} className="uppercase">
              {category}
            </span>
          ))}
        </div>

        <h2 className="text-lg font-bold text-gray-900 mt-1">
          {post.title.length <= 50
            ? post.title
            : post.title.substring(0, 50) + "..."}
        </h2>

        <p className="text-sm text-gray-600 mt-1">
          {post.description.length <= 100
            ? post.description
            : post.description.substring(0, 100) + "..."}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <button className="text-sm text-blue-600 font-medium hover:underline">
            Read More →
          </button>

          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <button className="flex items-center gap-1">
              {post.likes.length}
              <FaRegHeart />
            </button>
            <button className="flex items-center gap-1">
              {post.comments.length}
              <FaRegCommentDots />
            </button>
            <div className="flex items-center gap-1">
              {Math.floor(Math.random() * 10)}
              <IoIosStats />
            </div>

            {/* { post.author._id === authUser._id && (
              <div className="flex items-center ml-2 gap-4">
                <button>
                  <GoPencil />
                </button>
                <button>
                  <RiDeleteBin6Line />
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePostCard;
