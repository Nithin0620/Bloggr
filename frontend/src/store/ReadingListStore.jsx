import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL =
  process.env.REACT_APP_MODE === "development"
    ? "http://localhost:4000/api"
    : "/api";

export const useReadingListStore = create((set, get) => ({
  lists: [],
  currentList: null,
  loading: false,

  fetchMyLists: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/readinglists/mylists`, {
        withCredentials: true,
      });
      if (res.data.success) {
        set({ lists: res.data.data });
        return res.data.data;
      }
      return [];
    } catch (e) {
      console.error("fetchMyLists error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to fetch reading lists");
      return [];
    } finally {
      set({ loading: false });
    }
  },

  fetchListById: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/readinglists/${id}`);
      if (res.data.success) {
        set({ currentList: res.data.data });
        return res.data.data;
      }
      return null;
    } catch (e) {
      console.error("fetchListById error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to fetch reading list");
      return null;
    } finally {
      set({ loading: false });
    }
  },

  createList: async (name, description) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/readinglists/create`,
        { name, description },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Reading list created");
        set((state) => ({ lists: [res.data.data, ...state.lists] }));
        return res.data.data;
      }
      return null;
    } catch (e) {
      console.error("createList error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to create list");
      return null;
    }
  },

  deleteList: async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/readinglists/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Reading list deleted");
        set((state) => ({ lists: state.lists.filter((l) => l._id !== id) }));
        return true;
      }
      return false;
    } catch (e) {
      console.error("deleteList error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to delete list");
      return false;
    }
  },

  addPostToList: async (listId, postId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/readinglists/${listId}/addpost/${postId}`,
        null,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Post added to list");
        return true;
      }
      return false;
    } catch (e) {
      console.error("addPostToList error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to add post");
      return false;
    }
  },

  removePostFromList: async (listId, postId) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/readinglists/${listId}/removepost/${postId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Post removed from list");
        set((state) => ({
          currentList: state.currentList
            ? {
                ...state.currentList,
                posts: state.currentList.posts.filter((p) => p._id !== postId),
              }
            : null,
        }));
        return true;
      }
      return false;
    } catch (e) {
      console.error("removePostFromList error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to remove post");
      return false;
    }
  },
}));
