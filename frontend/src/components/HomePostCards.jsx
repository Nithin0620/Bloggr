import React, { useState } from 'react';
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { usePageStore } from '../store/PageStore';
import { useNavigate } from 'react-router-dom';
import { usePostStore } from '../store/PostStore';
import { useIntractionStore } from '../store/IntractionStore';
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { useAuthStore } from '../store/AuthStore';
import toast from 'react-hot-toast';
import { truncateContent } from '../lib/utils';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useBookmarkStore } from '../store/BookmarkStore';
import { BiListPlus } from "react-icons/bi";
import AddToReadingListModal from './AddToReadingListModal';


const HomePostCards = ({ post ,setLiked}) => {
  const navigate = useNavigate();
  const {setCurrentPage} = usePageStore();
  const {token , authUser} = useAuthStore();
  const {LikeUnlikePost,postsLikedByUser} = useIntractionStore();
  const {bookmarkedPostIds, toggleBookmark} = useBookmarkStore();
  const [showReadingListModal, setShowReadingListModal] = useState(false);
  

  const handleReadmoreClick = ()=>{
    if(!token && !authUser){
      toast.error("Please login first to intract with the post");
      return ;
    }

    // setPost(postId)
    setCurrentPage("ReadMore");
    navigate(`/readmore/${post._id}`)
  }
  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const updated = new Date(timestamp).getTime();
    const diffInMinutes = Math.floor((now - updated) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hr${diffInHours === 1 ? "" : "s"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  };


  const handleLike = async () => {
    if(!token && !authUser){
      toast.error("Please login first to intract with the post");
      return ;
    }
    const response = await LikeUnlikePost(post._id);
   
    setLiked(true);
    // setTimeout(()=>{
    //   setLiked(false)
    // },4000)
  };




  return (
  <>
  <div className="w-full p-2 lg:h-[29rem] h-auto rounded-2xl transition-colors duration-300 accent-bg-mode accent-text-mode">
    <div className="border accent-border accent-box-shadow rounded-xl shadow p-4 lg:h-[28rem] h-auto flex flex-col justify-between hover:scale-[1.015] transition-transform duration-300 ease-in-out">

      {/* Row 1 - Categories and Read Time */}
      <div className="flex justify-between items-center flex-wrap text-sm mb-2">
        <div className="flex gap-2 flex-wrap items-center">
          {post.categories.map((category, index) => (
            <span
              key={index}
              className="px-2 py-[2px] text-xs font-sans border accent-border rounded-md accent-text"
            >
              {category.name}
            </span>
          ))}
          {post.tags && post.tags.length > 0 && post.tags.map((tag, index) => (
            <span
              key={`tag-${index}`}
              className="px-2 py-[2px] text-xs font-sans bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md"
            >
              #{typeof tag === "string" ? tag : tag.name}
            </span>
          ))}
          <span className="font-extrabold opacity-60">•</span>
          <span className='text-xs'>{post.readTime} min read</span>
        </div>
      </div>

      {/* Image */}
      <div className="mb-2">
        <img
          src={post.image || "/placeholder.jpg"}
          alt="Post"
          className="w-full h-40 object-cover rounded-md shadow-sm"
        />
      </div>

      {/* Title */}
      <div className="text-lg font-semibold text-center mb-2">
        {post.title.length <= 35 ? post.title : post.title.substring(0, 35) + '...'}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 text-sm accent-text-mode mb-3">
        <div onClick={()=>navigate(`/profile/${post.author._id}`)} className="hover:underline cursor-pointer text-xs text-gray-400 italic">
          By {post.author.firstName + " "+ post.author.lastName || "Anonymous"} •{" "}
         
          {getTimeAgo(post.createdAt)}
        </div>
        <div className="text-sm accent-text-mode line-clamp-3">
          {truncateContent(post.content, 100)}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={() => handleReadmoreClick()}
          className="text-sm accent-text hover:underline transition"
        >
          Read More...
        </button>

        <div className="flex gap-3 items-center text-sm text-gray-500">
          <button onClick={()=>handleLike()} className="flex items-center gap-1 hover:text-red-500 transition duration-200">
            {postsLikedByUser.includes(post._id) ? <FaHeart className='text-red-500'/> : <FaRegHeart/> }
            {post.likes.length}
          </button>

          <button onClick={()=>handleReadmoreClick()} className="flex items-center gap-1 hover:text-blue-500 transition duration-200">
            <FaRegCommentDots />
            {post.comments.length}
          </button>

          <div className="flex items-center gap-1 hover:text-green-500 transition duration-200">
            <IoIosStats />
            {post.views}
          </div>

          <button
            onClick={() => {
              if (!token) { toast.error("Login to bookmark"); return; }
              toggleBookmark(post._id);
            }}
            className="flex items-center hover:text-yellow-500 transition duration-200"
          >
            {bookmarkedPostIds.includes(post._id) ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
          </button>

          <button
            onClick={() => {
              if (!token) { toast.error("Login to add to list"); return; }
              setShowReadingListModal(true);
            }}
            className="flex items-center hover:text-purple-500 transition duration-200"
            title="Add to reading list"
          >
            <BiListPlus />
          </button>
        </div>
      </div>
    </div>
  </div>
    <AddToReadingListModal
      isOpen={showReadingListModal}
      onClose={() => setShowReadingListModal(false)}
      postId={post._id}
    />
  </>
);
};

export default HomePostCards;
