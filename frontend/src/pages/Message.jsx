import React, { useRef, useCallback } from 'react';
import { useChatStore } from '../store/ChatStore';
import SideBar from '../components/SideBar';
import ChatSelected from '../components/ChatSelected';
import NoChatSelected from '../components/NoChatSelected';
import { IoChevronBack } from 'react-icons/io5';

const Message = () => {
  const { chatSelected, setChatSelected } = useChatStore();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    const threshold = 80;

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0 && chatSelected) {
        // Swipe left while in chat - go back
        setChatSelected(null);
      }
    }
  }, [chatSelected, setChatSelected]);

  return (
    <div
      className="flex md:flex-row md:mb-0 mb-7 flex-col min-h-screen transition-colors duration-300 accent-bg-mode accent-text-mode"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile back button when chat is selected */}
      {chatSelected && (
        <button
          onClick={() => setChatSelected(null)}
          className="md:hidden fixed top-4 left-16 z-50 p-2 rounded-full bg-accent text-white shadow-lg transition-all hover:scale-110"
        >
          <IoChevronBack size={20} />
        </button>
      )}

      {/* Sidebar */}
      <SideBar />

      {/* Chat area */}
      <div className="flex-1">
        {chatSelected ? <ChatSelected /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default Message;
