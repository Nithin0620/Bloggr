import React, { useEffect } from 'react';
import { useChatStore } from '../store/ChatStore';
import { useAuthStore } from '../store/AuthStore';

const emojiList = ['🔥', '🚀', '🎯', '💡', '✨', '🌟', '📚', '🧠'];

const getRandomEmoji = () => emojiList[Math.floor(Math.random() * emojiList.length)];

const UserList = () => {
  const {onlineUsers} = useAuthStore();
  const { users, getUsers } = useChatStore();

  useEffect(() => {
    getUsers(); // Fetch users on mount
  }, [getUsers]);

  return (
    <div className='flex flex-col gap-4'>
      <div className="p-3 md:w-full w-[60%] mx-auto md:mx-0 accent-text-mode accent-bg-mode rounded-xl shadow-md">
        <h2 className="text-md font-semibold mb-3">🧑‍💻Active Users</h2>
        <div className='w-full h-[0.08rem] rounded-full bg-slate-400 my-4'></div>
        <ul className="space-y-2">
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={index} className="flex items-center gap-2 font-serif accent-text">
                <span>{getRandomEmoji()}</span>
                <span>{user.firstName  || `User${index + 1}`}</span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-400">No users found.</p>
          )}
        </ul>
      </div>

      <div className="p-3 accent-text-mode  md:w-full w-[60%] mx-auto md:mx-0 accent-bg-mode rounded-xl shadow-md">
        <h2 className="text-md font-semibold mb-3">🧑‍💻Online Users</h2>
        <div className='w-full h-[0.08rem] rounded-full bg-slate-400 my-4'></div>
        <ul className="space-y-2">
          {onlineUsers.length > 0 ? (
            users.map((user, index) => (
              <li key={index} className="flex items-center gap-2 font-serif accent-text">
                <span>{getRandomEmoji()}</span>
                <span>{user.firstName  || `User${index + 1}`}</span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-400">No online users Currently.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
