import axios from "axios";
import { create } from "zustand";

const BASE_URL = "http://localhost:4000/api";

export const useIntractionStore = create((set, get) => ({
  postsLikedByUser: [],
  

  LikeUnlikePost: async (postId) => {
    try {
      const response = await axios.put(`${BASE_URL}/interactions/like-unlikepost/${postId}`);
      // console.log("responsesssss",response)

      if (response.data.success) {
        const likedPosts = get().postsLikedByUser;
        const alreadyLiked = likedPosts.includes(postId);
        // console.log("alreadyLiked",alreadyLiked)

        const updatedPosts = alreadyLiked
          ? likedPosts.filter(id => id !== postId) 
          : [...likedPosts, postId];      
          
          // console.log(updatedPosts)

        set({ postsLikedByUser: updatedPosts });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error("Error liking/unliking post:", e);
      return false;
    }
  },

  getAllPostLikedByCurrentUser: async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/interactions/getalllikedpostbycurrentuser`);
      console.log("response2", response);

      if (response.data.data) {
        const postIds = response.data.data.map(post => post._id);  
        set({ postsLikedByUser: postIds });
        console.log(postIds)
      }
    } catch (e) {
      console.log(e);
      console.log("Error in getAllPostLikedByCurrentUser");
    }
  }
}));
