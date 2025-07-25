import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const ChatSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="space-y-4 px-4 py-2 transition-colors duration-300 accent-text-mode">
      {skeletonMessages.map((_, index) => (
        <div
          key={index}
          className={`${index % 2 === 0 ? 'justify-end accent-bg-light' : 'justify-start'} flex`}
        >
          <div className="flex items-start space-x-2 shadow-accent-box rounded-lg p-2 ">
            <Skeleton variant="circular" width={15} height={15} animation="wave" />
            <div className="space-y-2">
              <Skeleton variant="rounded" width={30} height={10} animation="wave" />
              <Skeleton variant="rounded" width={50} height={20} animation="wave" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSkeleton;
