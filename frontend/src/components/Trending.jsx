import React, { useEffect, useState } from 'react'
import { usePostStore } from '../store/PostStore'
import { FaRegHeart } from "react-icons/fa6";
import {FaHeart} from "react-icons/fa"
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useIntractionStore } from '../store/IntractionStore';
import {Loader} from "lucide-react"
import { usePageStore } from '../store/PageStore';

const Trending = () => {
  const {posts,fetchPosts} = usePostStore();
  const {LikeUnlikePost,postsLikedByUser} = useIntractionStore();
  const {setCurrentPage} = usePageStore();


  const [Post,setPost] = useState([]);

  const [liked,setLiked] = useState(false);


  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    if(liked === false) window.scrollTo({top:0,behavior:'smooth'});

    console.log(postsLikedByUser)

    setLoading(true);
    const getposts = async()=>{
      
      const PostArray = await fetchPosts();
      setPost(PostArray);
      setLoading(false);
    }
    
    getposts();
    setLiked(false);
  },[liked])
  const navigate = useNavigate();

  const handleReadmoreClick = (postId)=>{
    setCurrentPage("ReadMore");
    setPost(postId)
    navigate(`/readmore/${postId}`)
  }

  

  const TrendingPostsWhole = Post.sort(
    (a, b) => (b.likes.length + b.views + b.comments.length) - (a.likes.length + a.views + a.comments.length)
  );

  const TrendingPostsFinal = TrendingPostsWhole.slice(0,5);


    const handleLike = async(postId)=>{
      const response = await LikeUnlikePost(postId);
      setLiked(true);
    }

  if(loading) return(
    <div className='min-h-screen flex justify-center mt-40'><Loader className='animate-spin h-9'/></div>
  )
  
  
  return (
    <div className="relative min-h-screen">        
      {
        TrendingPostsFinal.map((post,index)=> (
          <div key={index} className='relative'>
            {loading && (
              <div className="absolute inset-0 flex justify-center items-cente z-10">
                <div >
                  <Loader className="animate-spin" />
                </div>
              </div>
            )}

            <div className="flex rounded-2xl shadow-md border accent-border overflow-hidden w-full h-36 my-4 hover:scale-[1.01] transition-all duration-200 accent-bg-mode accent-text-mode">
              {/* Image Section */}
              <div className="flex items-center m-1 justify-center p-0 ">
                <img
                  src={post.image}
                  alt="Post"
                  className="rounded-lg object-cover w-24 h-24 shadow-sm"
                />
              </div>
        
              {/* Content Section */}
              <div className="w-2/3 p-2 flex flex-col justify-between">
                {/* Categories */}
                <div className="flex items-center gap-2 text-[0.55rem]  font-medium overflow-x-hidden ">
                  {post.categories.map((category, index) => (
                    <span key={index} className="uppercase tracking-wide border accent-border rounded-lg p-[0.15rem]">
                      {category.name}
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
                  {post.content.length <= 60
                    ? post.content
                    : post.content.substring(0, 50) + "..."}
                </p>
        
                {/* Bottom Section */}
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={()=>handleReadmoreClick(post._id)} className="text-[0.820rem] text-blue-500 hover:underline font-medium">
                    Read More →
                  </button>
        
                  <div className="flex items-center gap-[0.6rem]  text-[0.820rem]">
                    <button onClick={()=>handleLike(post._id)} className="flex items-center gap-1 hover:text-red-500 transition duration-200">
                      {post.likes.length }
                      {postsLikedByUser.includes(post._id) ? <FaHeart className='text-red-500'/> : <FaRegHeart/> }
                    </button>
                    <span onClick={()=>handleReadmoreClick(post._id)} className="flex items-center gap-1 transition-all duration-300 hover:text-green-500">
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
