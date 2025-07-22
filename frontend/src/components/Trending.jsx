import React from 'react'
import { usePostStore } from '../store/PostStore'
import { FaRegHeart } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Trending = () => {
  const {posts,setPost} = usePostStore();
  const navigate = useNavigate();

  const handleReadmoreClick = (postId)=>{
    setPost(postId)
    navigate(`/readmore/${postId}`)
  }

  const dummyProfilePosts = [
    {
      title: "The Future of AI in Software Development",
      description:
        "A deep dive into how artificial intelligence is reshaping the landscape of software engineering, from code generation to automated testing.",
      image: "https://source.unsplash.com/80x80/?ai,software",
      author: { _id: "user123", name: "Nithin KS" },
      readTime: 4,
      updatedTime: Date.now() - 6 * 60 * 1000,
      likes: [1, 2, 3],
      comments: [1],
      categories: ["Tech"]
    },
    {
      title: "React vs Vue: Choosing the Right Framework",
      description:
        "When starting a new project, picking the right JavaScript framework is critical. This article explores the pros and cons of React and Vue for beginners and pros alike.",
      image: "https://source.unsplash.com/80x80/?javascript,react",
      author: { _id: "user123", name: "Nithin KS" },
      readTime: 6,
      updatedTime: Date.now() - 15 * 60 * 1000,
      likes: [1, 2],
      comments: [],
      categories: ["Frontend", "JS"]
    },
    {
      title: "Mastering MongoDB Aggregations",
      description:
        "MongoDB’s aggregation pipeline is a powerful tool for data manipulation. This post explains how to use match, group, project, and sort stages effectively.",
      image: "https://source.unsplash.com/80x80/?database,mongodb",
      author: { _id: "user456", name: "Alex Morgan" },
      readTime: 8,
      updatedTime: Date.now() - 60 * 60 * 1000,
      likes: [],
      comments: [1, 2, 3, 4],
      categories: ["Database", "Backend"]
    }
  ];

  const TrendingPosts = posts.sort(
    (a, b) => (b.likes.length + b.views + b.comments.length) - (a.likes.length + a.views + a.comments.length)
  );
  
  return (
    <div>
      {
        dummyProfilePosts.map((post)=> (
          <div>
            <div className="flex rounded-2xl shadow-md border accent-border overflow-hidden w-full h-36 my-4 hover:scale-[1.01] transition-all duration-200 accent-bg-mode accent-text-mode">
              {/* Image Section */}
              <div className="w-1/3 min-w-[100px] flex items-center justify-center p-4 ">
                <img
                  src={post.image}
                  alt="Post"
                  className="rounded-lg object-cover w-20 h-20 shadow-sm"
                />
              </div>
        
              {/* Content Section */}
              <div className="w-2/3 p-2 flex flex-col justify-between">
                {/* Categories */}
                <div className="flex items-center gap-2 text-[0.55rem]  font-medium overflow-x-hidden ">
                  {post.categories.map((category, index) => (
                    <span key={index} className="uppercase tracking-wide border accent-border rounded-lg p-[0.15rem]">
                      {category}
                    </span>
                  ))}
                </div>
        
                {/* Title */}
                <h2 className="text-[1.1rem] font-semibold accent-text ">
                  {post.title.length <= 23
                    ? post.title
                    : post.title.substring(0, 23) + "..."}
                </h2>
        
                {/* Description */}
                <p className="text-sm mt-1 line-clamp-2">
                  {post.description.length <= 60
                    ? post.description
                    : post.description.substring(0, 60) + "..."}
                </p>
        
                {/* Bottom Section */}
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={()=>handleReadmoreClick(post._id)} className="text-[0.820rem] text-blue-500 hover:underline font-medium">
                    Read More →
                  </button>
        
                  <div className="flex items-center gap-2  text-[0.820rem]">
                    <span className="flex items-center gap-1 transition-all duration-300 hover:text-red-500">
                      {post.likes.length}
                      <FaRegHeart />
                    </span>
                    <span className="flex items-center gap-1 transition-all duration-300 hover:text-green-500">
                      {post.comments.length}
                      <FaRegCommentDots />
                    </span>
                    <span className="flex items-center gap-1 hover:text-blue-500 transition-all duration-300">
                      {post.views ? post.views : 0}
                      <IoIosStats />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
        
        
          </div>
        ))
      }
    </div>
  )
}

export default Trending
