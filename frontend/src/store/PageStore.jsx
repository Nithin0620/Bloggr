import { create } from "zustand";

export const usePageStore = create((set) => ({
  currentPage: localStorage.getItem("Curr-Page") || "home",
  
  setCurrentPage: (page) => {
    set({ currentPage: page })
    localStorage.setItem("Curr-Page",page);
  }
}));
