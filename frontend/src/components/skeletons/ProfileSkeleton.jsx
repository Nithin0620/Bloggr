import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const ProfileSkeleton = () => {
  return (
    <div className="w-full max-w-[58rem] mx-auto p-4">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Profile Picture */}
        <div className="flex justify-center md:justify-start">
          <Skeleton variant="circular" width={120} height={120} animation="wave" />
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 space-y-3">
          <Skeleton variant="rounded" width={200} height={28} animation="wave" />
          <Skeleton variant="rounded" width={150} height={20} animation="wave" />
          <Skeleton variant="rounded" width={300} height={16} animation="wave" />
          
          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <Skeleton variant="rounded" width={80} height={40} animation="wave" />
            <Skeleton variant="rounded" width={80} height={40} animation="wave" />
            <Skeleton variant="rounded" width={80} height={40} animation="wave" />
          </div>
        </div>
      </div>

      {/* Posts Section Skeleton */}
      <div className="space-y-4">
        <Skeleton variant="rounded" width={120} height={24} animation="wave" />
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 border accent-border rounded-xl">
            <Skeleton variant="rounded" width={180} height={120} animation="wave" className="rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="rounded" width="60%" height={18} animation="wave" />
              <Skeleton variant="rounded" width="40%" height={14} animation="wave" />
              <Skeleton variant="rounded" width="100%" height={12} animation="wave" />
              <Skeleton variant="rounded" width="90%" height={12} animation="wave" />
              <div className="flex gap-4 mt-2">
                <Skeleton variant="rounded" width={60} height={20} animation="wave" />
                <Skeleton variant="rounded" width={60} height={20} animation="wave" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
