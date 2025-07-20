import { create } from "zustand";

export const usePageStore = create((set) => ({
  currentPage: localStorage.getItem("Curr-Page") || "home",

  isCreatePostOpen: false,
  
  setIsCreatePostOpen: (val) => {
    set({ isCreatePostOpen: val })
    // console.log(isCreatePostOpen);
  },
  
  setCurrentPage: (page) => {
    set({ currentPage: page })
    localStorage.setItem("Curr-Page",page);
  }
}));
