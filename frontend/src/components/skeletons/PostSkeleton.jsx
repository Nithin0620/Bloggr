import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const PostSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array(count).fill(null).map((_, index) => (
        <div
          key={index}
          className="w-full p-2 lg:h-[29rem] h-auto rounded-2xl transition-colors duration-300 accent-bg-mode accent-text-mode"
        >
          <div className="border accent-border accent-box-shadow rounded-xl shadow p-4 lg:h-[28rem] h-auto flex flex-col justify-between">
            {/* Categories skeleton */}
            <div className="flex gap-2 mb-2">
              <Skeleton variant="rounded" width={60} height={20} animation="wave" />
              <Skeleton variant="rounded" width={40} height={20} animation="wave" />
            </div>

            {/* Image skeleton */}
            <Skeleton 
              variant="rounded" 
              width="100%" 
              height={160} 
              animation="wave" 
              className="mb-2 rounded-md"
            />

            {/* Title skeleton */}
            <Skeleton variant="rounded" width="80%" height={24} animation="wave" className="mx-auto mb-2" />

            {/* Author skeleton */}
            <Skeleton variant="rounded" width="50%" height={14} animation="wave" className="mb-2" />

            {/* Content skeleton */}
            <div className="space-y-2 mb-3">
              <Skeleton variant="rounded" width="100%" height={12} animation="wave" />
              <Skeleton variant="rounded" width="90%" height={12} animation="wave" />
              <Skeleton variant="rounded" width="70%" height={12} animation="wave" />
            </div>

            {/* Footer skeleton */}
            <div className="flex justify-between items-center mt-auto">
              <Skeleton variant="rounded" width={80} height={20} animation="wave" />
              <div className="flex gap-3">
                <Skeleton variant="circular" width={20} height={20} animation="wave" />
                <Skeleton variant="circular" width={20} height={20} animation="wave" />
                <Skeleton variant="circular" width={20} height={20} animation="wave" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostSkeleton;
