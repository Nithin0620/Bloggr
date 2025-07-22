import { create } from "zustand";

export const useShareModalStore = create((set) => ({
   isShareModalOpen: false,
   shareType: null, // 'profile', 'bloggr', 'post'
   shareData: null, // any extra data (userId or postId)

   
   openShareModal: (type, data = null) => {
      set({ isShareModalOpen: true, shareType: type, shareData: data })
   },
   closeShareModal: () => {
      set({ isShareModalOpen: false, shareType: null, shareData: null })
   },
}));
