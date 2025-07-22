import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

// Utility function to get "mins ago"
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const published = new Date(timestamp);
  const diffMs = now - published;

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 8.64e+7);

   if(diffDays >=1){
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      
   }
   else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
   } else {
      return diffMins <= 0 ? "Just now" : `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
   }
};

const handleLikeClick = ()=>{
   toast("Please visit the Read More page for full blog interaction ✨", {
      duration: 4000,
      icon: "📖",
      style: {
         background: "#fff3cd",
         color: "#856404",
      //   border: "1px solid #ffeeba",
         border: "1px solid #334155",
         padding: "12px 18px",
         fontWeight: "500",
         fontSize: "0.9rem",
      },
      ariaProps: {
         role: "status",
         "aria-live": "polite",
      },
   });
}


const DevToPostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl mx-auto my-4 accent-bg-mode accent-text-mode border rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-300">
      <div className="flex flex-col md:flex-row w-full">
        {/* Cover Image */}
        <div className="w-full md:w-1/3 h-48 md:h-auto">
          <img
            src={
              post.cover_image ||
              "https://www.webnode.com/blog/wp-content/uploads/2019/04/blog2.png"
            }
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={post.user.profile_image}
              alt={post.user.name}
              className="w-5 h-5 rounded-full"
            />
            <p className="text-[0.820rem] font-semibold">{post.user.name}</p>
            <p className="text-xs text-opacity-5 ml-auto">
              {getTimeAgo(post.published_timestamp)}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 text-[0.65rem] overflow-x-hidden font-medium">
            {post.tag_list.map((tag, index) => (
              <span
                key={index}
                className="uppercase tracking-wide border accent-border rounded-lg px-2 py-[2px] bg-accent/5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="text-[1.05rem] font-semibold mt-2 accent-text">
            {post.title.length > 45
              ? post.title.substring(0, 45) + "..."
              : post.title}
          </h2>

          {/* Description */}
          <p className="text-sm mt-1 line-clamp-2 accent-text-mode">
            {post.description.length > 50
              ? post.description.substring(0, 50) + "..."
              : post.description}
          </p>

          {/* Bottom Section */}
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => window.open(post.url)}
              className="text-sm text-blue-500 hover:underline font-medium"
            >
              Read More →
            </button>

            <div onClick={()=>handleLikeClick()} className="flex items-center gap-3 text-sm text-opacity-90">
              <span className="flex items-center gap-1 hover:text-red-500 transition">
                {post.positive_reactions_count}
                <FaRegHeart />
              </span>
              <span className="flex items-center gap-1 hover:text-green-500 transition">
                {post.comments_count}
                <FaRegCommentDots />
              </span>
              <span className="text-xs ml-2">{post.reading_time_minutes} min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevToPostCard;
