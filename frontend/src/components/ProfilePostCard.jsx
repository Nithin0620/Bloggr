import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { usePageStore } from "../store/PageStore";
import { useIntractionStore } from "../store/IntractionStore";

const ProfilePostCard = ({
  post,
  setLiked,
  setIsDeleteModalOpen,
  setDeletePostid,
}) => {
  const { setIsUpdatePostOpen, setUpdatePost } = usePageStore();
  const { LikeUnlikePost, postsLikedByUser } = useIntractionStore();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const handleReadmoreClick = (postId) => {
    navigate(`/readmore/${postId}`);
  };

  const handleUpdatePost = () => {
    setIsUpdatePostOpen(true);
    setUpdatePost(post);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
    setDeletePostid(post._id);
  };

  const handleLike = async () => {
    await LikeUnlikePost(post._id);
    setLiked(true);
  };

  return (
    <div className="w-full max-w-[58rem] mx-auto my-5 transition-all duration-200 hover:scale-[1.01] accent-bg-mode accent-text-mode rounded-2xl shadow-md border accent-border overflow-hidden">
      <div className="flex gap-20 flex-col sm:flex-row">
        <div className="sm:w-48 w-full h-52 sm:h-auto">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex gap-1 flex-col justify-between p-4 flex-1">
          <div className="flex flex-wrap gap-1 text-[0.7rem] font-medium">
            {post.categories.map((category, index) => (
              <span
                key={index}
                className="uppercase tracking-wide border accent-border rounded-lg px-1 py-[0.15rem]"
              >
                {category.name}
              </span>
            ))}
          </div>

          <h2 className="text-base sm:text-lg font-semibold mt-1 accent-text">
            {post.title.length <= 50
              ? post.title
              : post.title.substring(0, 50) + "..."}
          </h2>

          <p className="text-sm mt-1 line-clamp-2">
            {post.content.length <= 100
              ? post.content
              : post.content.substring(0, 100) + "..."}
          </p>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={() => handleReadmoreClick(post._id)}
              className="text-sm text-blue-500 hover:underline font-medium"
            >
              Read More →
            </button>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span
                onClick={handleLike}
                className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-all duration-300"
              >
                {post.likes.length}
                {postsLikedByUser.includes(post._id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
              </span>

              <span className="flex items-center gap-1 hover:text-green-500 transition-all duration-300">
                {post.comments.length}
                <FaRegCommentDots />
              </span>

              <span className="flex items-center gap-1 hover:text-blue-500 transition-all duration-300">
                {post.views}
                <IoIosStats />
              </span>

              {post.author._id && (
                <div className="flex items-center gap-3 text-[1rem] ml-2">
                  <button
                    onClick={handleUpdatePost}
                    className="accent-text transition"
                  >
                    <GoPencil />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="hover:text-red-600 transition duration-200"
                  >
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
