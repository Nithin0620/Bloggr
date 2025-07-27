import React from 'react';
import { useChatStore } from '../store/ChatStore';
import SideBar from '../components/SideBar';
import ChatSelected from '../components/ChatSelected';
import NoChatSelected from '../components/NoChatSelected';

const Message = () => {
  const { chatSelected } = useChatStore();

  return (
    <div className="flex md:flex-row md:mb-0 mb-7 flex-col  min-h-screen transition-colors duration-300 accent-bg-mode accent-text-mode"> 
      {/* Sidebar */}
      <SideBar />

      {/* Chat area */}
      <div className="flex-1 ">
        {chatSelected ? <ChatSelected /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default Message;
