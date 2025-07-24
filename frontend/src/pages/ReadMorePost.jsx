import React, { useEffect, useInsertionEffect, useState } from 'react';
import Comment from "../components/Comment";
import { usePostStore } from '../store/PostStore';
import RelatedBlogs from '../components/RelatedBlogs';
import { IoMdShare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { IoCaretBack } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { usePageStore } from '../store/PageStore';
import { useShareModalStore } from '../store/ShareModal';
import { Loader } from 'lucide-react';
import { useIntractionStore } from '../store/IntractionStore';


const ReadMorePost = () => {
   const {LikeUnlikePost,postsLikedByUser} = useIntractionStore();
   console.log("posts liked by user",postsLikedByUser)
   

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

   const {getPostByID } = usePostStore();
   const [loading,setLoading] = useState(false);

   const {postId} = useParams();
   const [post,setPost] =useState({
            "_id": "6880a85524dadbeff66740ea",
            "title": "5 Ways to Make Your Developer Portfolio Stand Out in 2025",
            "author": {
                "_id": "687f2df9f63a839959e579f7",
                "firstName": "Nithin",
                "lastName": "KS"
            },
            "content": "Your developer portfolio is more than just a website—it's your personal brand. In a sea of developers, your portfolio can either be a game-changer or get lost in the crowd. Here are 5 powerful ways to make yours stand out in 2025.\r\n\r\n1. 🖼️ Make It Visually Appealing\r\nFirst impressions matter. Use clean typography, consistent colors, and responsive design. Tools like Tailwind CSS or shadcn/ui can help you build fast and beautifully.\r\n\r\nBonus tip: Add subtle animations using Framer Motion to make interactions smooth and professional.\r\n\r\n2. 📌 Show, Don’t Just Tell\r\nDon’t just list your skills—demonstrate them with live projects. Add links to:\r\n\r\nGitHub repos\r\n\r\nLive demos\r\n\r\nCase studies or blog posts explaining your process\r\n\r\nRecruiters love developers who can walk the talk.\r\n\r\n3. 📽️ Add a Personal Introduction\r\nA short video introduction or about-me section makes you more relatable. Let your personality shine—talk about your journey, your motivation, or even a fun fact about yourself.\r\n\r\n4. 🧠 Focus on Value-Based Projects\r\nBuild and showcase projects that solve real problems, even if they're small:\r\n\r\nA task manager for students\r\n\r\nA weather app with local storage\r\n\r\nAn AI-powered chatbot for exam prep\r\n\r\nThese kinds of projects show you're not just a coder—you’re a problem-solver.\r\n\r\n5. 🛠️ Keep Updating It\r\nYour portfolio is not a one-time thing. Update it with:\r\n\r\nNew projects\r\n\r\nTech stack updates\r\n\r\nBlog posts or certifications\r\n\r\nInclude a blog section to share what you’ve learned recently—it shows you're actively growing.\r\n\r\n🚀 Final Advice\r\nYour portfolio is your story—make it honest, functional, and reflective of your goals. Keep it updated, focused, and personalized. In 2025, your portfolio might just be the thing that lands you your dream job.",
            "categories": [
                {
                    "_id": "687f39d71ace835152d1d512",
                    "name": "DevOps"
                },
                {
                    "_id": "686d23d6f4e71788efea3a53",
                    "name": "Tech"
                }
            ],
            "likes": [
                {
                    "_id": "687f2df9f63a839959e579f7",
                    "firstName": "Nithin",
                    "lastName": "KS",
                    "createdAt": "2025-07-22T06:21:45.811Z"
                }
            ],
            "comments": [],
            "image": "https://res.cloudinary.com/dii5njq9f/image/upload/v1753262157/jhhlwhljc9zjsoljhh0f.jpg",
            "views": 8,
            "readTime": "5",
            "createdAt": "2025-07-23T09:16:05.745Z",
            "updatedAt": "2025-07-23T13:08:41.754Z",
            "__v": 21
        });

   const [liked,setLiked] = useState(false);

   useEffect(()=>{
      if(liked === false) window.scrollTo({top:0,behavior:'smooth'});
      const fetchReadMorePost = async()=>{
         setLoading(true);
         // console.log("here")
         const response = await getPostByID(postId);
         setPost(response)
         // console.log("response",response)
         setLoading(false);
      }
      fetchReadMorePost();
      setLiked(false);
   },[liked]);

   const {setCurrentPage} = usePageStore();
   const {openShareModal} = useShareModalStore();
   const navigate=useNavigate();
   const handleNavigate=()=>{
      navigate(-1);
      setCurrentPage("home")
   }

   const handleLike = async()=>{
      const response = await LikeUnlikePost(post._id);
      setLiked(true);
   }

   // if(loading || !post) return (
   //   <div className="relative min-h-max">
   //       {loading && (
   //       <div className="absolute inset-0 flex justify-center items-cente z-10">
   //          <div >
   //             <Loader className="animate-spin" />
   //          </div>
   //       </div>
   //       )}
   //   </div>
   // )

   return (
      <div className="relative px-4 md:px-12 pb-20 lg:px-24 transition-colors duration-300 accent-bg-mode accent-text-mode">
         {loading && (
         <div className="absolute inset-0 flex justify-center items-cente z-10">
            <div >
               <Loader className="animate-spin" />
            </div>
         </div>
         )}
         <div onClick={() => handleNavigate()} className='  pt-9 cursor-pointer flex accent-text left-0 items-center accent-shadow hover:scale-105 transition-all ease-in-out duration-500 font-sans gap-2'><IoCaretBack/> Back</div>
         <div className="flex sm:flex-col md:flex-row gap-8 pt-5">
            {/* LEFT: Post Content */}
            <div className="w-full lg:w-[70%] space-y-6">
               <h1 className="text-3xl font-bold accent-text">{post.title}</h1>

               <div className="flex flex-wrap gap-2 transition-colors duration-300 accent-bg-mode accent-box-shadow accent-text-mode">
                  {post.categories.map((category, index) => (
                     <span
                        key={index}
                        className="text-sm px-2 py-1 rounded-full ring-2 mr-3 accent-shadow accent-box-shadow"
                     >
                        {category.name}
                     </span>
                  ))}
               </div>

               <div className="text-sm text-gray-500 flex gap-4 flex-wrap">
                  <span className="accent-text">{post.author.firstName + " " + post.author.lastName}</span>
                  <span>• {getTimeAgo(post.createdAt)}</span>
                  <span>• {post.readTime} min read</span>
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
                  {post.content}
               </div>

               <div className="flex gap-10 transition-all duration-300 text-sm">
                  <span onClick={()=>handleLike()} className=" cursor-pointer hover:text-red-500">{postsLikedByUser.includes(post._id) ? <FaHeart className='text-red-500'/> : <FaRegHeart/> } Like {post.likes.length}</span>
                  <span className=" cursor-pointer hover:text-blue-500"> <FaRegCommentDots /> Comment {post.comments.length}</span>
                  <span className=" cursor-pointer hover:text-green-500"> <IoIosStats /> Views {post.views}</span>
                  <span onClick={()=>openShareModal("post",{postId:post._id})} className=" cursor-pointer hover:text-yellow-500"><IoMdShare/> Share</span>
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
               <Comment post={post._id} />
            </div>
         </div>
      </div>
   );
};

export default ReadMorePost;
