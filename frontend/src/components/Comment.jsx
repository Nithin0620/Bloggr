import React, { useRef, useState } from 'react';
import { IoSend } from "react-icons/io5";
import { FaComments } from "react-icons/fa";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import { usePostStore } from '../store/PostStore';

const Comment = () => {
  const {currentPostForReadMore:post} = usePostStore();
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const addEmoji = (emoji) => {
    const cursorPos = inputRef.current.selectionStart;
    const textBefore = inputValue.substring(0, cursorPos);
    const textAfter = inputValue.substring(cursorPos);
    const updated = textBefore + emoji.native + textAfter;
    setInputValue(updated);
    setShowEmojiPicker(false);
  };

  return (
    <div className="sticky top-16 transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-semibold flex items-center gap-2 accent-text mb-3">
          <FaComments /> Comments
        </h2>

        {/* Input box */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl transition-colors duration-300 accent-bg-mode accent-text-mode"
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
          
          <button className="accent-text text-xl">
            <IoSend />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute z-10 mt-2">
            <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4 mt-4">
          {post.comments.map((comment, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-accent-box">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                  <img src={comment.user.profilePic} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">
                    {comment.user.name}
                    <span className="ml-2 text-xs text-gray-500">
                      • {Math.floor((Date.now() - comment.updatedTime) / (1000 * 60))} mins ago
                    </span>
                  </div>
                  <div className="text-sm mt-1">{comment.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
