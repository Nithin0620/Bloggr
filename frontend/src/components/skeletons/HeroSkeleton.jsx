import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const HeroSkeleton = () => {
  return (
    <div className="w-full p-4 rounded-2xl transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Skeleton variant="circular" width={60} height={60} animation="wave" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="rounded" width="60%" height={20} animation="wave" />
          <Skeleton variant="rounded" width="40%" height={16} animation="wave" />
        </div>
        <Skeleton variant="rounded" width={120} height={40} animation="wave" className="rounded-full" />
      </div>
    </div>
  );
};

export default HeroSkeleton;
