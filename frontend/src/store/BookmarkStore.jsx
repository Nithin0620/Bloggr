import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL =
  process.env.REACT_APP_MODE === "development"
    ? "http://localhost:4000/api"
    : "/api";

export const useBookmarkStore = create((set, get) => ({
  bookmarkedPostIds: [],
  bookmarks: [],
  loading: false,

  toggleBookmark: async (postId) => {
    try {
      const res = await axios.put(`${BASE_URL}/bookmarks/toggle/${postId}`, null, {
        withCredentials: true,
      });
      if (res.data.success) {
        const { bookmarked } = res.data;
        set((state) => {
          const ids = bookmarked
            ? [...state.bookmarkedPostIds, postId]
            : state.bookmarkedPostIds.filter((id) => id !== postId);
          return { bookmarkedPostIds: ids };
        });
        toast.success(bookmarked ? "Post bookmarked" : "Bookmark removed");
      }
    } catch (e) {
      console.error("toggleBookmark error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to update bookmark");
    }
  },

  fetchBookmarkedIds: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/bookmarks/getids`, {
        withCredentials: true,
      });
      if (res.data.success) {
        set({ bookmarkedPostIds: res.data.data });
      }
    } catch (e) {
      console.error("fetchBookmarkedIds error:", e.response?.data || e.message);
    }
  },

  fetchBookmarks: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/bookmarks/getall`, {
        withCredentials: true,
      });
      if (res.data.success) {
        set({ bookmarks: res.data.data });
        return res.data.data;
      }
      return [];
    } catch (e) {
      console.error("fetchBookmarks error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to fetch bookmarks");
      return [];
    } finally {
      set({ loading: false });
    }
  },
}));
