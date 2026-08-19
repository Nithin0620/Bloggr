import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  (process.env.REACT_APP_MODE === "development"
    ? "http://localhost:4000/api/v1"
    : "https://bloggr-y7gx.onrender.com/api/v1");

const getCachedData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage quota exceeded or error caching data:", e);
  }
};

export const useBookmarkStore = create((set, get) => ({
  bookmarkedPostIds: getCachedData("bloggr_bookmarked_ids", []),
  bookmarks: getCachedData("bloggr_bookmarks", []),
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
          setCachedData("bloggr_bookmarked_ids", ids);
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
        setCachedData("bloggr_bookmarked_ids", res.data.data);
      }
    } catch (e) {
      console.error("fetchBookmarkedIds error:", e.response?.data || e.message);
    }
  },

  fetchBookmarks: async () => {
    const cached = getCachedData("bloggr_bookmarks", null);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      set({ bookmarks: cached });
    } else {
      set({ loading: true });
    }

    try {
      const res = await axios.get(`${BASE_URL}/bookmarks/getall`, {
        withCredentials: true,
      });
      if (res.data.success) {
        set({ bookmarks: res.data.data });
        setCachedData("bloggr_bookmarks", res.data.data);
        return res.data.data;
      }
      return cached || [];
    } catch (e) {
      console.error("fetchBookmarks error:", e.response?.data || e.message);
      if (!cached || cached.length === 0) {
        toast.error(e.response?.data?.message || "Failed to fetch bookmarks");
      }
      return cached || [];
    } finally {
      set({ loading: false });
    }
  },
}));
