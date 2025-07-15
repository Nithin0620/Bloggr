import React from 'react'
import { FaRegHeart } from "react-icons/fa6"
import { FaRegCommentDots } from "react-icons/fa"
import { IoIosStats } from "react-icons/io"

const HomePostCards = ({ post }) => {
   return (
      <div className="w-full  p-2">
         <div className="border rounded-lg shadow p-4 h-[28rem]  flex flex-col justify-between">
         {/* Row 1 */}
         <div className="flex justify-between items-center flex-wrap text-sm mb-2">
            <div className="flex gap-2 flex-wrap">
               {post.categories.map((category, index) => (
               <h1 key={index} className='px-[0.15rem] py-[0.10rem] text-xs font-sans border-solid border-2 rounded-lg'>{category}</h1>
               ))} <div className='font-extrabold'>•</div>  {post.readTime} min read
            </div>
         </div>

         {/* Image */}
         <div className="mb-2">
            <img src={post.image} alt="Post" className="w-full h-40 object-cover rounded" />
         </div>

         {/* Title */}
         <div className="text-lg font-semibold text-center mb-2">
            {post.title.length <= 35 ? post.title : post.title.substring(0, 35) + '...'}
         </div>

         {/* Description */}
         <div className="flex flex-col gap-2 text-sm text-gray-700 mb-3">
            <div>
               By {post.author} • {Math.floor((Date.now() - post.updatedTime) / (1000 * 60))} mins ago
            </div>
            <div>
               {post.description.length <= 100
               ? post.description
               : post.description.substring(0, 100) + '...'}
            </div>
         </div>

         {/* Footer */}
         <div className="flex justify-between items-center mt-auto">
            <button className="text-sm underline">Read More...</button>
            <div className="flex gap-4 items-center text-sm">
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
            </div>
         </div>
         </div>
      </div>
   )
}

export default HomePostCards
