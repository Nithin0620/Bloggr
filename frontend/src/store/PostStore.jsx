import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import { SEED_CATEGORIES, SEED_POSTS } from "../lib/seedData";

const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api/v1" : "https://bloggr-y7gx.onrender.com/api/v1";


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

export const usePostStore = create((set, get) => ({
  createPostLoading: false,
  updatePostLoading: false,

  readMorePostData: null,
  isReadMoreLoading: false,
  categoriesList: getCachedData("bloggr_cached_categories", SEED_CATEGORIES),

  posts: getCachedData("bloggr_cached_posts", SEED_POSTS),
  nextCursor: null,
  hasMore: true,
  fetchPostLoading: false,

  setPosts: async () => {

  },

  fetchCategories: async () => {
    const cached = getCachedData("bloggr_cached_categories", null);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      set({ categoriesList: cached });
    } else {
      set({ createPostLoading: true });
    }

    try {
      const res = await axios.get(`${BASE_URL}/category/getallcategory`);
      if (res.data.success) {
        const categoryArray = res.data.data.map(category => category.name);
        set({ categoriesList: categoryArray });
        setCachedData("bloggr_cached_categories", categoryArray);
        return categoryArray;
      }
      return cached || [];
    }
    catch (e) {
      console.error("fetchCategories error:", e.response?.data || e.message);
      return cached || [];
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
    const cached = getCachedData("bloggr_cached_posts", null);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      set({ posts: cached });
    } else {
      set({ fetchPostLoading: true });
    }

    try {
      const response = await axios.get(`${BASE_URL}/post/getallposts`);
      if (response.data?.success || response.data?.data) {
        const freshPosts = response.data.data || [];
        set({
          posts: freshPosts,
          nextCursor: response.data.nextCursor,
          hasMore: response.data.hasMore,
        });
        setCachedData("bloggr_cached_posts", freshPosts);
        return freshPosts;
      }
      return cached || [];
    }
    catch (e) {
      console.error("fetchPosts error:", e.response?.data || e.message);
      if (!cached || cached.length === 0) {
        toast.error(e.response?.data?.message || "Failed to load posts");
      }
      return cached || [];
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
    // If the post is already in loaded posts or local storage, display immediately
    const existing = get().posts?.find((p) => p._id === postId || p.id === postId);
    if (existing) {
      set({ readMorePostData: existing, isReadMoreLoading: false });
    } else {
      const cached = getCachedData(`bloggr_post_${postId}`, null);
      if (cached) {
        set({ readMorePostData: cached, isReadMoreLoading: false });
      } else {
        set({ isReadMoreLoading: true });
      }
    }

    try {
      const response = await axios.get(`${BASE_URL}/post/getpostbyid/${postId}`);
      if (response.data?.success) {
        set({ readMorePostData: response.data.data });
        setCachedData(`bloggr_post_${postId}`, response.data.data);
        return response.data.data;
      }
    }
    catch (e) {
      console.error("getPostByID error:", e.response?.data || e.message);
      if (!get().readMorePostData) {
        toast.error(e.response?.data?.message || "Failed to load post");
      }
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
  },

  aiGenerateMeta: async (content) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/generate-meta`,
        { content },
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (e) {
      console.error("aiGenerateMeta error:", e.response?.data || e.message);
      toast.error("Our AI service is currently facing downtime. Please give us some time to rectify it.");
      return null;
    }
  },

  aiSuggestCategories: async (content, categories) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/suggest-categories`,
        { content, categories },
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.data.categories;
      }
      return [];
    } catch (e) {
      console.error("aiSuggestCategories error:", e.response?.data || e.message);
      toast.error("Our AI service is currently facing downtime. Please give us some time to rectify it.");
      return [];
    }
  },

  aiSummarize: async (content, postId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/summarize`,
        { content, postId },
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.data.summary;
      }
      return null;
    } catch (e) {
      console.warn("aiSummarize background warning:", e.response?.data || e.message);
      return null;
    }
  },

  aiSuggestComment: async (postTitle, postContent) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/suggest-comment`,
        { postTitle, postContent },
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.data.comments;
      }
      return [];
    } catch (e) {
      console.error("aiSuggestComment error:", e.response?.data || e.message);
      toast.error("Our AI service is currently facing downtime. Please give us some time to rectify it.");
      return [];
    }
  },

  getRelatedPosts: async (postId) => {
    try {
      const response = await axios.get(`${BASE_URL}/post/related/${postId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (e) {
      console.error("getRelatedPosts error:", e.response?.data || e.message);
      return [];
    }
  },

  fetchTrendingPosts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/post/trending`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (e) {
      console.error("fetchTrendingPosts error:", e.response?.data || e.message);
      return [];
    }
  },

  triggerSentimentScoring: async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/sentiment-score`,
        {},
        { withCredentials: true }
      );
      return response.data.success;
    } catch (e) {
      console.error("triggerSentimentScoring error:", e.response?.data || e.message);
      return false;
    }
  },

  aiSearchPosts: async (query) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/search`,
        { query },
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (e) {
      console.error("aiSearchPosts error:", e.response?.data || e.message);
      return null;
    }
  },

  semanticVectorSearch: async (query) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/search/semantic?q=${encodeURIComponent(query)}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (e) {
      console.error("semanticVectorSearch error:", e.response?.data || e.message);
      return [];
    }
  },

  aiGenerateBio: async (userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/generate-bio`,
        { userId },
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.data.bio;
      }
      return null;
    } catch (e) {
      console.error("aiGenerateBio error:", e.response?.data || e.message);
      toast.error("Our AI service is currently facing downtime. Please give us some time to rectify it.");
      return null;
    }
  },

}))
