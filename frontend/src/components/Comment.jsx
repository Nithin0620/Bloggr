import React, { useEffect, useRef, useState } from 'react';
import { IoSend } from "react-icons/io5";
import { FaComments } from "react-icons/fa";
// import Picker from '@emoji-mart/react';
// import data from '@emoji-mart/data';
import { usePostStore } from '../store/PostStore';
import { Loader } from 'lucide-react';
import { MdOutlineAutoDelete } from "react-icons/md";
import {toast} from "react-hot-toast"
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';

const Comment = ({ post:id}) => {
  const navigate = useNavigate();
  const {authUser} = useAuthStore();
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const { getComments,sendComment ,deleteComment} = usePostStore();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(null);

  useEffect(()=>{
    // console.log(showEmojiPicker)
  },showEmojiPicker)

  const [newComment,setNewComment] = useState(false);

  useEffect(() => {
    // console.log("herhe2")
    const fetchComments = async () => {
      // console.log("herhe1",id)

      if (!id) return;
      
      setLoading(true);
      try {
        // console.log("here")
        const fetchedComments = await getComments(id);
        // console.log("fetched comments :",fetchedComments)
        setComments(fetchedComments.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    setNewComment(false);
    
    fetchComments();
  }, [id, getComments,newComment]); 


  const handleSendComment = async()=>{
    await sendComment({comment:inputValue},id);
    setInputValue("");
    setNewComment(true);
  }

  const handleDeleteComment = async(comment)=>{
    if(comment.user._id !== authUser._id){
      toast.error("you are not the author of this comment.")
      return;
    }
    const commentDate = new Date(comment.updatedAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));
    if(diffInMinutes>3){
      toast.error("you can't delete Comment After 3 mins!")
      return;
    }
    await deleteComment(id,comment._id);
    setNewComment(true);
  }
  // console.log("in the comment page", comments);

  const addEmoji = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPos = inputRef.current?.selectionStart || 0;
    const textBefore = inputValue.substring(0, cursorPos);
    const textAfter = inputValue.substring(cursorPos);
    const updated = textBefore + emoji + textAfter;
    setInputValue(updated);
    setShowEmojiPicker(false);
  };


  // Helper function to calculate time difference
  const getTimeAgo = (dateString) => {
    const commentDate = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes === 1) return "1 min ago";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  if (loading || !comments) return (
    <div className='flex items-center justify-center p-4'>
      <Loader className='animate-spin' />
    </div>
  );


  return (
    <div className="sticky top-16 transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-semibold flex items-center gap-2 accent-text mb-3">
          <FaComments /> Comments ({comments.length})
        </h2>

        {/* Input box */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl transition-colors -ml-3 duration-300 accent-bg-mode accent-text-mode"
          >
            😊
          </button>

          <input
            ref={inputRef}
            type="text"
            className="border border-gray-300 rounded-lg p-2 w-full shadow-accent-box transition-colors duration-300 accent-bg-mode accent-text-mode"
            placeholder="Add new comment..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <button onClick={()=>handleSendComment()} className="accent-text text-xl">
            <IoSend />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute z-10 mt-2 right-0 transform -translate-x-5 shadow-md bg-white dark:bg-black rounded-md">
            <EmojiPicker
              onEmojiClick={(emojiData) => addEmoji(emojiData)}
              theme="auto" // 'light', 'dark', or 'auto'
              width={300}
            />
          </div>
        )}



        {/* Comments */}
        <div className="space-y-4 mt-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="p-3 border border-gray-200 rounded-lg shadow-accent-box">
                <div className="flex items-start gap-2">
                  <div className='flex flex-col items-center gap-2'>
                    <div className="w-8 h-8 rounded-full overflow-hidden accent-bg-mode">
                      <img
                        src={comment.user.profilePic || '/default-avatar.png'}
                        alt="User"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div onClick={()=>handleDeleteComment(comment)} className='text-red-400 cursor-pointer transition-all duration-150 ml-[0.3rem] mt-1 my-auto hover:text-red-600'>{comment.user._id === authUser._id && <MdOutlineAutoDelete/>}</div>
                  </div>
                  
                  <div className="flex-1">
                    <div onClick={()=>navigate(`/profile/${comment.user._id}`)} className="cursor-pointer hover:underline text-sm flex items-center font-semibold">
                      {comment.user.firstName + " " + comment.user.lastName}
                      <span className="ml-2 text-xs accent-text-mode">
                        • {getTimeAgo(comment.updatedAt)}
                      </span>
                      
                      
                    </div>
                    <div className="text-sm mt-1">{comment.text}</div>
                  </div>
                  
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500">No comments to show</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;