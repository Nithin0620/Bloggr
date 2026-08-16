// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useMemo } from 'react'
import { usePostStore } from '../store/PostStore'
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useIntractionStore } from '../store/IntractionStore';
// eslint-disable-next-line no-unused-vars
import {Loader, Sparkles} from "lucide-react"
import { usePageStore } from '../store/PageStore';
import { truncateContent } from '../lib/utils';
import { useBookmarkStore } from '../store/BookmarkStore';
import { useAuthStore } from '../store/AuthStore';

const Trending = () => {
  const {fetchTrendingPosts} = usePostStore();
  const {LikeUnlikePost,postsLikedByUser} = useIntractionStore();
  const {setCurrentPage} = usePageStore();
  const {bookmarkedPostIds, toggleBookmark} = useBookmarkStore();
  const {token} = useAuthStore();

  const [Post,setPost] = useState([]);
  const [liked,setLiked] = useState(false);
  const [loading,setLoading] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const counts = {};
    const liked = {};
    Post.forEach(p => {
      counts[p._id] = p.likes.length;
      liked[p._id] = postsLikedByUser.includes(p._id);
    });
    setLikeCounts(counts);
    setLikedPosts(liked);
  }, [Post, postsLikedByUser]);

  useEffect(()=>{
    if(liked === false) window.scrollTo({top:0,behavior:'smooth'});

    setLoading(true);
    const getposts = async()=>{
      const PostArray = await fetchTrendingPosts();
      setPost(PostArray);
      setLoading(false);
    }
    
    getposts();
    setLiked(false);
  },[liked, fetchTrendingPosts])
  const navigate = useNavigate();

  const handleReadmoreClick = (postId)=>{
    setCurrentPage("ReadMore");
    navigate(`/readmore/${postId}`)
  }

  const handleLike = async(postId)=>{
    const result = await LikeUnlikePost(postId);
    if (result) {
      setLikeCounts(prev => ({ ...prev, [postId]: result.likesCount }));
      setLikedPosts(prev => ({ ...prev, [postId]: result.liked }));
    }
  }

  if(loading) return(
    <div className='min-h-screen flex justify-center mt-40'><Loader className='animate-spin h-9'/></div>
  )
  
  
  return (
    <div className="relative min-h-screen">        
      {
        Post.map((post,index)=> (
          <div key={index} className='relative'>

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
                  {truncateContent(post.content, 60)}
                </p>
        
                {/* Bottom Section */}
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={()=>handleReadmoreClick(post._id)} className="text-[0.820rem] text-blue-500 hover:underline font-medium">
                    Read More →
                  </button>
        
                  <div className="flex items-center gap-[0.6rem]  text-[0.820rem]">
                    {post.trendingScore !== undefined && (
                      <span 
                        className="flex items-center gap-0.5 text-amber-500 font-bold text-[0.7rem] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20"
                        title="Multi-signal AI Trending Score"
                      >
                        🔥 {post.trendingScore}
                      </span>
                    )}
                    <button onClick={()=>handleLike(post._id)} className="flex items-center gap-1 hover:text-red-500 transition duration-200">
                      {likeCounts[post._id] ?? post.likes.length }
                      {likedPosts[post._id] ? <FaHeart className='text-red-500'/> : <FaRegHeart/> }
                    </button>
                    <span onClick={()=>handleReadmoreClick(post._id)} className="flex items-center gap-1 transition-all duration-300 hover:text-green-500">
                      {post.comments.length}
                      <FaRegCommentDots />
                    </span>
                    <span className="flex items-center gap-1 hover:text-blue-500 transition-all duration-300">
                      {post.views ? post.views : 0}
                      <IoIosStats />
                    </span>
                    <button
                      onClick={() => {
                        if (!token) return;
                        toggleBookmark(post._id);
                      }}
                      className="flex items-center gap-1 hover:text-yellow-500 transition duration-200"
                    >
                      {bookmarkedPostIds.includes(post._id) ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
                    </button>
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
