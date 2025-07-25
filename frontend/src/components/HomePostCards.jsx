import React from 'react';
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { usePageStore } from '../store/PageStore';
import { useNavigate } from 'react-router-dom';
import { usePostStore } from '../store/PostStore';
import { useIntractionStore } from '../store/IntractionStore';
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";


const HomePostCards = ({ post ,setLiked}) => {
  // console.log("in home postcard component",post)
  const navigate = useNavigate();
  const {setCurrentPage} = usePageStore();
  const {LikeUnlikePost,postsLikedByUser} = useIntractionStore();
  

  const handleReadmoreClick = ()=>{

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
    const response = await LikeUnlikePost(post._id);
   
    setLiked(true);
    // setTimeout(()=>{
    //   setLiked(false)
    // },4000)
  };




  return (
  <div className="w-full p-2 h-[29rem] rounded-2xl transition-colors duration-300 accent-bg-mode accent-text-mode">
    <div className="border accent-border accent-box-shadow rounded-xl shadow p-4 h-[28rem] flex flex-col justify-between hover:scale-[1.015] transition-transform duration-300 ease-in-out">

      {/* Row 1 - Categories and Read Time */}
      <div className="flex justify-between items-center flex-wrap text-sm mb-2">
        <div className="flex gap-2 flex-wrap items-center">
          {post.categories.map((category, index) => (
            <span
              key={index}
              className="px-2 py-[2px] text-xs font-sans border accent-border rounded-md accent-text"
            >
              {category.name} {/* fallback if category is a string */}
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
        <div className="text-xs text-gray-400 italic">
          By {post.author.firstName + " "+ post.author.lastName || "Anonymous"} •{" "}
         
          {getTimeAgo(post.createdAt)}
        </div>
        <div>
          {post.content.length <= 100
            ? post.content
            : post.content.substring(0, 100) + '...'}
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

        <div className="flex gap-4 items-center text-sm text-gray-700">
          <button onClick={()=>handleLike()} className="flex items-center gap-1 hover:text-red-500 transition duration-200">
            {post.likes.length }
            {postsLikedByUser.includes(post._id) ? <FaHeart className='text-red-500'/> : <FaRegHeart/> }
          </button>

          <button onClick={()=>handleReadmoreClick()} className="flex items-center gap-1 hover:text-blue-500 transition duration-200">
            {post.comments.length}
            <FaRegCommentDots />
          </button>

          <div className="flex items-center gap-1 hover:text-green-500 transition duration-200">
            {post.views}
            <IoIosStats />
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default HomePostCards;
