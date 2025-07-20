import React from 'react';
import Comment from "../components/Comment";
import { usePostStore } from '../store/PostStore';
import RelatedBlogs from '../components/RelatedBlogs';
import { IoMdShare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { IoCaretBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const ReadMorePost = () => {
   const { currentPostForReadMore: post } = usePostStore();
   const navigate=useNavigate();
   return (
      <div className=" px-4 md:px-12 pb-20 lg:px-24 transition-colors duration-300 accent-bg-mode accent-text-mode">
         <div onClick={() => {navigate(-1)}} className='  pt-9 cursor-pointer flex accent-text left-0 items-center accent-shadow hover:scale-105 transition-all ease-in-out duration-500 font-sans gap-2'><IoCaretBack/> Back</div>
         <div className="flex gap-4 pt-5">
            {/* LEFT: Post Content */}
            <div className="w-full lg:w-[70%] space-y-6">
               <h1 className="text-3xl font-bold accent-text">{post.title}</h1>

               <div className="flex flex-wrap gap-2 transition-colors duration-300 accent-bg-mode accent-box-shadow accent-text-mode">
                  {post.categories.map((category, index) => (
                     <span
                        key={index}
                        className="text-sm px-2 py-1 rounded-full ring-2 mr-3 accent-shadow accent-box-shadow"
                     >
                        {category}
                     </span>
                  ))}
               </div>

               <div className="text-sm text-gray-500 flex gap-4 flex-wrap">
                  <span className="accent-text">{post.author}</span>
                  <span>• {Math.floor((Date.now() - post.updatedTime) / (1000 * 60))} mins ago</span>
                  <span>• estimated {Math.floor((Date.now() - post.readTime) / (1000 * 60))} min read</span>
               </div>

               <div>
                  <img
                     src={post.image}
                     alt="Post Banner"
                     className="rounded-lg shadow-accent-box w-full"
                  />
               </div>

               <div className="h-[0.12rem] rounded-full min-w-full accent-bg-dark"></div>

               <div className="leading-7 text-base text-justify whitespace-pre-wrap">
                  {post.description}
               </div>

               <div className="flex gap-10 transition-all duration-300 text-sm">
                  <span className=" cursor-pointer hover:text-red-500"> <FaRegHeart /> Like {post.likes.length}</span>
                  <span className=" cursor-pointer hover:text-blue-500"> <FaRegCommentDots /> Comment {post.comments.length}</span>
                  <span className=" cursor-pointer hover:text-green-500"> <IoIosStats /> Views {Math.floor(Math.random() * 10)}</span>
                  <span className=" cursor-pointer hover:text-yellow-500"><IoMdShare/> Share</span>
               </div>

               <div className='flex justify-center pt-14 pb-14 font-semibold'>
                  ########## <h1 className='px-5 font-bold font-serif accent-text accent-underline'>END OF THE BLOG</h1> ##########
               </div>

               <div className='min-w-full h-[0.12rem] bg-slate-400'></div>

               <div>
                  <RelatedBlogs />
               </div>
            </div>

            <div className='min-h-screen w-[0.12rem] bg-gray-400 mx-5'></div>

            {/* RIGHT: Comment Section */}
            <div className="w-full lg:w-[25%] top-0">
               <Comment />
            </div>
         </div>
      </div>
   );
};

export default ReadMorePost;
