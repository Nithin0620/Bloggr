import React from 'react';
import { useChatStore } from '../store/ChatStore';
import SideBar from '../components/SideBar';
import ChatSelected from '../components/ChatSelected';
import NoChatSelected from '../components/NoChatSelected';

const Message = () => {
  const { chatSelected } = useChatStore();

  return (
    <div className="flex min-h-screen"> 
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
