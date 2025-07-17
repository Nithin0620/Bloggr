import { create } from "zustand";

export const useChatStore = create((set,get)=>({
   messages: [],
   users: [],
   selectedUser: null,
   isUsersLoading: false,
   isMessagesLoading: false,

   getUsers: ()=>{

   },

   setSelectedUser: (selectedUser) => set({ selectedUser }),
}))