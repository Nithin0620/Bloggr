import React, { useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useChatStore } from '../store/ChatStore';
import { formatMessageTime } from '../lib/utils';
import { useAuthStore } from '../store/AuthStore';
import ChatSkeleton from './skeletons/ChatSkeleton';

const ChatSelected = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="min-h-screen accent-bg-light shadow-accent-box transition-colors duration-300 accent-bg-mode accent-text-mode">
        <ChatHeader />
        <ChatSkeleton />
        <MessageInput />
      </div>
    );
  }


  const handleHiSend = async () => {
    try {
      await sendMessage({
        text: `Hi there, ${authUser.firstName} here!`,
        image:null
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col accent-border border min-h-[77vh] rounded-2xl mx-5 mt-5 overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
       { messages.length === 0 &&
          (<div className=' w-full h-[50vh] flex gap-3 items-center justify-center'>
              {messages.length ===  0 ? <div className='flex-col items-center  justify-center text-opacity-90' ><p className='font-semibold text-opacity-90 text-lg mx-auto'>No messages Yet</p> <button onClick={()=>handleHiSend()} className='mx-3 shadow-accent-box hover:scale-105 accent-text font-semibold transition-all duration-200 cursor-context-menu'>Say Hi on chat?</button> </div>: <div></div>}
          </div>)
       }
        

         
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatSelected;
