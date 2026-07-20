import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast"

const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api/v1" : "/api/v1";


export const usePostStore = create((set, get) => ({
  createPostLoading: false,
  updatePostLoading: false,

  readMorePostData: null,
  isReadMoreLoading: false,
  categoriesList: [],

  posts: [],
  nextCursor: null,
  hasMore: true,
  fetchPostLoading: false,

  setPosts: async () => {

  },

  fetchCategories: async () => {
    set({ createPostLoading: true });
    try {
      const res = await axios.get(`${BASE_URL}/category/getallcategory`);
      if (res.data.success) {
        const categoryArray = res.data.data.map(category => category.name);
        set({ categoriesList: categoryArray });
        return categoryArray;
      }
      return [];
    }
    catch (e) {
      console.error("fetchCategories error:", e.response?.data || e.message);
      return [];
    }
    finally {
      set({ createPostLoading: false });
    }
  },

  fetchPostsByCategories: async (e) => {
    set({ createPostLoading: true });
    try {
      const res = await axios.get(`${BASE_URL}/category/getpostsbycategory/${e}`);
      if (res.data.success) {
        const categoryPostArray = res.data.data;
        return categoryPostArray;
      }
    }
    catch (e) {
      console.error("fetchPostsByCategories error:", e.response?.data || e.message);
      toast.error("Unable to fetch post by category!")
      return [];
    }
    set({ createPostLoading: false });
  },
  createCategory: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/category/createcategory`, { categoryName: data });

      if (response.data.success) {
        toast.success("New Category Created Successfully!")
        return true;
      }
      else {
        toast.error("Unable to create New category. pls try again after some time.");
        return false;
      }
    }
    catch (e) {
      console.error("createCategory error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Unable to create New category.")
      return false;
    }
  },

  fetchPosts: async () => {
    set({ fetchPostLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/post/getallposts`);
      set({
        posts: response.data.data,
        nextCursor: response.data.nextCursor,
        hasMore: response.data.hasMore,
      })
      return response.data.data;
    }
    catch (e) {
      console.error("fetchPosts error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to load posts")
      return [];
    }
    finally {
      set({ fetchPostLoading: false });
    }
  },

  fetchMorePosts: async () => {
    const { nextCursor, posts } = get();
    if (!nextCursor) return;
    set({ fetchPostLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/post/getallposts?cursor=${encodeURIComponent(nextCursor)}&limit=12`);
      set({
        posts: [...posts, ...response.data.data],
        nextCursor: response.data.nextCursor,
        hasMore: response.data.hasMore,
      });
    }
    catch (e) {
      console.error("fetchMorePosts error:", e.response?.data || e.message);
      toast.error("Failed to load more posts");
    }
    finally {
      set({ fetchPostLoading: false });
    }
  },

  fetchScheduledPosts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/post/getscheduledposts`, {
        withCredentials: true,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (e) {
      console.error("fetchScheduledPosts error:", e.response?.data || e.message);
      return [];
    }
  },

  getPostByID: async (postId) => {
    set({ isReadMoreLoading: true });
    try {
      const response = await axios.get(`${BASE_URL}/post/getpostbyid/${postId}`);
      set({ readMorePostData: response.data.data })
      return response.data.data;
    }
    catch (e) {
      console.error("getPostByID error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to load post");
      return [];
    }
    finally {
      set({ isReadMoreLoading: false });
    }
  },

  getComments: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/interactions/getcomments/${id}`)
      return response.data;
    }
    catch (e) {
      console.error("getComments error:", e.response?.data || e.message);
      return [];
    }
  },

  sendComment: async (data, postId) => {
    try {
      const response = await axios.post(`${BASE_URL}/interactions/addcomment/${postId}`, data);

      if (response.data.success) {
        toast.success("comment added Successfully");
      }
      else {
        toast.error("Unable to add comment, Please try again after sometime");
      }
    }
    catch (e) {
      console.error("sendComment error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to add comment");
    }
  },

  deleteComment: async (id, commentId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/interactions/deletecomment/${id}/${commentId}`);

      if (response.data.success) {
        toast.success("comment Deleted Successfully");
      }
      else {
        toast.error("Unable to Delete comment, Please try again after sometime");
      }
    }
    catch (e) {
      console.error("deleteComment error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to delete comment");
    }
  },

  createPost: async (formData) => {
    set({ createPostLoading: true });
    try {
      const res = await axios.post(
        `${BASE_URL}/post/createpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("New Blog posted successfully.")
        return true;
      }
      else {
        toast.error("Error occured in posting the Blog!")
        return false;
      }
    }
    catch (e) {
      console.error("createPost error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Error occured in posting the Blog!")
      return false;
    }
    finally {
      set({ createPostLoading: false });
    }
  },
  updatePost: async (formData, postId) => {
    set({ updatePostLoading: true });
    try {
      const res = await axios.put(
        `${BASE_URL}/post/updatepost/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(" Blog updated successfully.")
      }
      else {
        toast.error("Error occured in updating the Blog!")
      }
    }
    catch (e) {
      console.error("updatePost error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Error occured in updating the Blog!")
    }
    finally {
      set({ updatePostLoading: false });
    }
  },
  deletePost: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/post/deletepost/${id}`)

      if (response.data.success) {
        return true;
      }
      else { return false };

    }
    catch (e) {
      console.error("deletePost error:", e.response?.data || e.message);
      toast.error(e.response?.data?.message || "Failed to delete post")
    }
  }

}))
