import React, { useEffect, useState, useCallback } from 'react';
import Comment from "../components/Comment";
import { usePostStore } from '../store/PostStore';
import RelatedBlogs from '../components/RelatedBlogs';
import ReadingProgress from '../components/ReadingProgress';
import ImageLightbox from '../components/ImageLightbox';
import ArticleInsights from '../components/ArticleInsights';
import ReaderAssistant from '../components/ReaderAssistant';
import PodcastPlayer from '../components/PodcastPlayer';
import { IoMdShare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { IoCaretBack } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { usePageStore } from '../store/PageStore';
import { useShareModalStore } from '../store/ShareModal';
import { Loader, Sparkles } from 'lucide-react';
import { useIntractionStore } from '../store/IntractionStore';
import { useBookmarkStore } from '../store/BookmarkStore';
import { useAuthStore } from '../store/AuthStore';
import toast from 'react-hot-toast';


const ReadMorePost = () => {
   const {LikeUnlikePost,postsLikedByUser} = useIntractionStore();
   const {bookmarkedPostIds, toggleBookmark} = useBookmarkStore();
   // eslint-disable-next-line no-unused-vars
   const {token, authUser} = useAuthStore();
   

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

   const {getPostByID, aiSummarize } = usePostStore();
   const [loading,setLoading] = useState(false);
   const [summaryLoading, setSummaryLoading] = useState(false);
   const [postSummary, setPostSummary] = useState(null);

   const {postId} = useParams();
   const [post, setPost] = useState(null);
   const [liked, setLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(0);
   const [isLiked, setIsLiked] = useState(false);
   const [lightboxOpen, setLightboxOpen] = useState(false);
   const [lightboxImages, setLightboxImages] = useState([]);
   const [lightboxIndex, setLightboxIndex] = useState(0);

   const openLightbox = useCallback((images, index = 0) => {
      setLightboxImages(images);
      setLightboxIndex(index);
      setLightboxOpen(true);
   }, []);

   const closeLightbox = useCallback(() => {
      setLightboxOpen(false);
      setLightboxImages([]);
      setLightboxIndex(0);
   }, []);

   const prevImage = useCallback(() => {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
   }, [lightboxImages.length]);

   const nextImage = useCallback(() => {
      setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
   }, [lightboxImages.length]);

   useEffect(()=>{
      if(liked === false) window.scrollTo({top:0,behavior:'smooth'});
      setPostSummary(null);
      const fetchReadMorePost = async()=>{
         setLoading(true);
         const fetchedPost = await getPostByID(postId);
         if (fetchedPost) {
            setPost(fetchedPost);
            setLikeCount(Array.isArray(fetchedPost.likes) ? fetchedPost.likes.length : 0);
            setIsLiked(Array.isArray(postsLikedByUser) ? postsLikedByUser.includes(fetchedPost._id) : false);
         }
         setLoading(false);
      }
      fetchReadMorePost();
      setLiked(false);
   },[liked, getPostByID, postId, postsLikedByUser]);

   useEffect(() => {
      if (!post || !post._id || !post.content) return;
      if (typeof post._id === "string" && post._id.startsWith("seed-")) return;
      if (post.summary) {
         setPostSummary(post.summary);
         return;
      }
      const generateSummary = async () => {
         setSummaryLoading(true);
         const summary = await aiSummarize(post.content, post._id);
         if (summary) setPostSummary(summary);
         setSummaryLoading(false);
      };
      generateSummary();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [post?._id, post?.content]);

   const {setCurrentPage} = usePageStore();
   const {openShareModal} = useShareModalStore();
   const navigate=useNavigate();
   const handleNavigate=()=>{
      navigate(-1);
      setCurrentPage("home")
   }

   const handleLike = async()=>{
      const result = await LikeUnlikePost(post._id);
      if (result) {
         setLikeCount(result.likesCount);
         setIsLiked(result.liked);
      }
   }

   if (!post && loading) {
      return (
         <div className="min-h-[70vh] flex items-center justify-center accent-bg-mode">
            <Loader className="w-8 h-8 animate-spin text-emerald-500" />
         </div>
      );
   }

   if (!post && !loading) {
      return (
         <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center accent-bg-mode accent-text-mode">
            <h2 className="text-2xl font-bold mb-2">Post not found</h2>
            <p className="text-sm opacity-70 mb-6">The article you are looking for does not exist or has been removed.</p>
            <button onClick={() => navigate("/")} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition">
               Back to Home
            </button>
         </div>
      );
   }

   return (
      <div className="relative px-4 md:px-12 pb-20 lg:px-24 transition-colors duration-300 accent-bg-mode accent-text-mode">
         <ReadingProgress />
         
         {lightboxOpen && (
            <ImageLightbox
               images={lightboxImages}
               currentIndex={lightboxIndex}
               onClose={closeLightbox}
               onPrev={prevImage}
               onNext={nextImage}
            />
         )}
         
         {loading && (
         <div className="absolute inset-0 flex justify-center items-cente z-10">
            <div >
               <Loader className="animate-spin" />
            </div>
         </div>
         )}
         <div onClick={() => handleNavigate()} className='  pt-9 cursor-pointer flex accent-text left-0 items-center accent-shadow hover:scale-105 transition-all ease-in-out duration-500 font-sans gap-2'><IoCaretBack/> Back</div>
         <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* LEFT: Post Content */}
            <div className="w-full lg:w-[70%] space-y-6">
               <h1 className="text-3xl font-bold accent-text">{post?.title}</h1>

               <div className="flex flex-wrap gap-2 items-center transition-colors duration-300 accent-bg-mode accent-box-shadow accent-text-mode">
                  {(Array.isArray(post?.categories) ? post.categories : []).map((category, index) => {
                     const catName = typeof category === "string" ? category : category?.name || "General";
                     return (
                        <span
                           key={index}
                           className="text-sm px-2 py-1 rounded-full ring-2 mr-3 accent-shadow accent-box-shadow"
                        >
                           {catName}
                        </span>
                     );
                  })}
                  {post.grammar?.score !== undefined && (
                     <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                           post.grammar.score >= 80
                              ? "text-green-500 border-green-500/30 bg-green-500/10"
                              : post.grammar.score >= 60
                              ? "text-amber-500 border-amber-500/30 bg-amber-500/10"
                              : "text-red-500 border-red-500/30 bg-red-500/10"
                        }`}
                        title="Grammar Score"
                     >
                        Grammar: {post.grammar.score}
                     </span>
                  )}
                  {post.seo?.score !== undefined && (
                     <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                           post.seo.score >= 80
                              ? "text-green-500 border-green-500/30 bg-green-500/10"
                              : post.seo.score >= 60
                              ? "text-amber-500 border-amber-500/30 bg-amber-500/10"
                              : "text-red-500 border-red-500/30 bg-red-500/10"
                        }`}
                        title="SEO Score"
                     >
                        SEO: {post.seo.score}
                     </span>
                  )}
                  {post.difficulty?.level && (
                     <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${
                           post.difficulty.level === "beginner"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : post.difficulty.level === "advanced"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        }`}
                        title="Difficulty Level"
                     >
                        {post.difficulty.level}
                     </span>
                  )}
                  {post.embeddingStatus === "completed" && (
                     <span
                        className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium flex items-center gap-1.5"
                        title="Vector embedded for AI semantic search & RAG assistant"
                     >
                        ✨ Vector Indexed
                     </span>
                  )}
               </div>

               <div className="text-sm accent-text-mode opacity-70 flex gap-4 flex-wrap">
                  <span onClick={()=>navigate(`/profile/${post.author._id}`)} className="cursor-pointer hover:underline accent-text">{post.author.firstName + " " + post.author.lastName}</span>
                  <span>• {getTimeAgo(post.createdAt)}</span>
                  <span>• {post.readTime} min read</span>
               </div>

               <div>
                  <img
                     src={post.image}
                     alt="Post Banner"
                     className="rounded-lg shadow-accent-box w-full cursor-pointer hover:opacity-90 transition-opacity"
                     onClick={() => openLightbox([post.image], 0)}
                  />
               </div>

               <ArticleInsights post={post} />
               <PodcastPlayer articleId={post._id} articleTitle={post.title} />

               {(summaryLoading || postSummary) && (
                  <div className="tldr-container rounded-xl p-[2px]">
                     <div className="tldr-inner rounded-xl px-5 py-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Sparkles className="w-4 h-4 accent-text" />
                           <span className="text-xs font-bold uppercase tracking-wider accent-text">
                              {summaryLoading ? "Generating TL;DR..." : "TL;DR"}
                           </span>
                        </div>
                        {summaryLoading ? (
                           <div className="flex items-center gap-2 text-sm opacity-60">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span>Generating summary...</span>
                           </div>
                        ) : (
                           <p className="text-sm leading-relaxed">{postSummary}</p>
                        )}
                     </div>
                  </div>
               )}

               <div className="h-[0.12rem] rounded-full min-w-full accent-bg-dark"></div>

               <div 
                  className="leading-7 text-base text-justify prose-content" 
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  onClick={(e) => {
                     if (e.target.tagName === 'IMG') {
                        const images = Array.from(e.currentTarget.querySelectorAll('img')).map(img => img.src);
                        const index = images.indexOf(e.target.src);
                        openLightbox(images, index >= 0 ? index : 0);
                     }
                  }}
               />

               <div className="flex gap-10 transition-all duration-300 text-sm">
                  <span onClick={()=>handleLike()} className=" cursor-pointer hover:text-red-500">{(isLiked || postsLikedByUser.includes(post._id)) ? <FaHeart className='text-red-500'/> : <FaRegHeart/> } Like {likeCount}</span>
                  <span onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className=" cursor-pointer hover:text-blue-500"> <FaRegCommentDots /> Comment {post.comments.length}</span>
                  <span className=" cursor-pointer hover:text-green-500"> <IoIosStats /> Views {post.views}</span>
                  <span onClick={()=>{
                     if(!token){toast.error("Login to bookmark");return;}
                     toggleBookmark(post._id);
                  }} className=" cursor-pointer hover:text-yellow-500">
                     {bookmarkedPostIds.includes(post._id) ? <FaBookmark className="text-yellow-500"/> : <FaRegBookmark/>} Save
                  </span>
                  <span onClick={()=>openShareModal("post",{postId:post._id})} className=" cursor-pointer hover:text-purple-500"><IoMdShare/> Share</span>
               </div>

               <div className='flex justify-center pt-14 pb-14 font-semibold'>
                  ########## <h1 className='px-5 font-bold font-serif accent-text accent-underline'>END OF THE BLOG</h1> ##########
               </div>

               <div className="block lg:hidden h-[0.12rem] w-full accent-bg-dark my-5"></div>

               <div>
                  <RelatedBlogs postId={post._id} />
               </div>
            </div>

            <div className="hidden lg:block lg:min-h-screen w-[0.12rem] accent-bg-dark mx-5"></div>

            {/* RIGHT: Comment Section */}
               <div className="w-full lg:w-[25%]">
                  <Comment post={post._id} postTitle={post.title} postContent={post.content} />
            </div>
         </div>
         <ReaderAssistant articleId={post._id} articleTitle={post.title} />
      </div>
   );
};

export default ReadMorePost;
