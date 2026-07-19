import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL =
  process.env.REACT_APP_MODE === "development"
    ? "http://localhost:4000/api"
    : "/api";

export const useTagStore = create((set) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/tags/getall`);
      if (res.data.success) {
        set({ tags: res.data.data });
        return res.data.data;
      }
      return [];
    } catch (e) {
      console.error("fetchTags error:", e.response?.data || e.message);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  createTag: async (name) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/tags/create`,
        { name },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Tag created");
        set((state) => ({ tags: [...state.tags, res.data.data] }));
        return res.data.data;
      }
      return null;
    } catch (e) {
      console.error("createTag error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to create tag");
      return null;
    }
  },

  fetchPostsByTag: async (tagId) => {
    try {
      const res = await axios.get(`${BASE_URL}/tags/getpostsbytag/${tagId}`);
      if (res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (e) {
      console.error("fetchPostsByTag error:", e.response?.data || e.message);
      toast.error("Failed to fetch posts by tag");
      return null;
    }
  },
}));
