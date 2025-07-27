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
    <div className="flex-1 flex flex-col custom-scroll accent-border border min-h-[79vh] max-h-[79vh] rounded-2xl mx-5 mt-5 overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
       { messages.length === 0 &&
          (<div className=' w-full h-[50vh] flex gap-3 items-center justify-center'>
              {messages.length ===  0 ? <div className='flex-col items-center  justify-center text-opacity-90' ><p className='font-semibold text-opacity-90 text-lg mx-auto'>No messages Yet</p> <button onClick={()=>handleHiSend()} className='mx-3 shadow-accent-box hover:scale-105 accent-text font-semibold transition-all duration-200 cursor-context-menu'>Say Hi on chat?</button> </div>: <div></div>}
          </div>)
       }
        

         
        {messages.map((message) => {
          const isSentByMe = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`w-full flex ${isSentByMe ? "justify-end" : "justify-start"} mb-4`}
              ref={messageEndRef}
            >
              <div className={`flex items-end space-x-2 ${isSentByMe ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className="w-8 h-8 rounded-full border overflow-hidden">
                  <img
                    src={
                      isSentByMe
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex flex-col max-w-xs sm:max-w-sm md:max-w-md">
                  <div className={`text-[10px] accent-text-mode mb-1 ${isSentByMe ? "text-right pr-1" : "text-left pl-1"}`}>
                    {formatMessageTime(message.createdAt)}
                  </div>

                  <div
                    className={`chat-bubble  p-2 text-sm break-words shadow-sm
                    ${isSentByMe
                      ? "accent-bg bg-opacity-70 text-white self-end rounded-t-2xl rounded-bl-2xl "
                      : "accent-bg-mode border accent-border rounded-t-2xl rounded-br-2xl accent-text-mode self-start "
                    }`}
                  >
                    {/* Image if present */}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-md mb-2 max-w-[200px] sm:max-w-[250px] shadow"
                      />
                    )}

                    {/* Text if present */}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      <MessageInput />
    </div>
  );
};

export default ChatSelected;
