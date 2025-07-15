import { create } from "zustand";

export const usePageStore = create((set) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
}));
