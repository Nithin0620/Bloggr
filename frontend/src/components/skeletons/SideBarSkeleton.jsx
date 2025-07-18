import React from 'react';
import { Users } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';

const SideBarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="w-full transition-colors duration-300 accent-text-mode accent-bg-mode">
      <div className="border-b border-base-300 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="space-y-4">
          {skeletonContacts.map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 shadow-accent-box rounded-lg p-2 accent-bg-light"
            >
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className="space-y-1">
                <Skeleton variant="rounded" width={160} height={10} animation="wave" />
                <Skeleton variant="rounded" width={120} height={10} animation="wave" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBarSkeleton;
