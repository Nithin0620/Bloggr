import { create } from "zustand";

export const usePageStore = create((set) => ({
  currentPage: localStorage.getItem("Curr-Page") || "home",
  updatePost:null,
  setUpdatePost : (post)=>{
    set({updatePost:post})
  },
  isCreatePostOpen: false,
  
  isUpdatePostOpen: false,
  
  setIsUpdatePostOpen: (val) => {
    set({ isUpdatePostOpen: val })
    // console.log(isUpdatePostOpen);
  },

  setIsCreatePostOpen: (val) => {
    set({ isCreatePostOpen: val })
    // console.log(isCreatePostOpen);
  },
  
  setCurrentPage: (page) => {
    set({ currentPage: page })
    localStorage.setItem("Curr-Page",page);
  }
}));
