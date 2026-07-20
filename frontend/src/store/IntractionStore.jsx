import axios from "axios";
import { create } from "zustand";
import {toast} from "react-hot-toast"

const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api/v1" : "/api/v1";

export const useIntractionStore = create((set, get) => ({
  postsLikedByUser: [],

  LikeUnlikePost: async (postId) => {
    try {
      const response = await axios.put(`${BASE_URL}/interactions/like-unlikepost/${postId}`);

      if (response.data.success) {
        const likedPosts = get().postsLikedByUser;
        const alreadyLiked = likedPosts.includes(postId);

        const updatedPosts = alreadyLiked
          ? likedPosts.filter(id => id !== postId)
          : [...likedPosts, postId];

        set({ postsLikedByUser: updatedPosts });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error("LikeUnlikePost error:", e.response?.data || e.message);
      return false;
    }
  },

  getAllPostLikedByCurrentUser: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/interactions/getalllikedpostbycurrentuser`);

      if (response.data.data) {
        const postIds = response.data.data.map(post => post._id);
        set({ postsLikedByUser: postIds });
      }
    } catch (e) {
      console.error("getAllPostLikedByCurrentUser error:", e.response?.data || e.message);
    }
  },


  getAllNotifications : async()=>{
    try{
      const response  = await axios.get(`${BASE_URL}/interactions/getallnotification`)

      if(response.data.success){
        return response.data.data;
      }
      else return [];
    }
    catch(e){
      console.error("getAllNotifications error:", e.response?.data || e.message);
      return [];
    }
  },

  MarkAllAsRead : async()=>{
    try{
      const response  = await axios.put(`${BASE_URL}/interactions/markallasread`)

      if(response.data.success){
        toast.success("All notification marked as read")
      }
      else toast.error("Error occured in marking all as read, please try again after sometime")
    }
    catch(e){
      console.error("MarkAllAsRead error:", e.response?.data || e.message);
      toast.error("Error occured in marking all as read, please try again after sometime")
    }
  },
  MarkNotificationAsRead : async(notificationId)=>{
    try{
      const response  = await axios.put(`${BASE_URL}/interactions/setnotificationasread/${notificationId}`)

      if(response.data.success){
        toast.success("Notification marked as read")
      }
      else toast.error("Error occured in marking Notification as read, please try again after sometime")
    }
    catch(e){
      console.error("MarkNotificationAsRead error:", e.response?.data || e.message);
      toast.error("Error occured in marking Notification as read, please try again after sometime")
    }
  },
  DeleteNotification : async(notificationId)=>{
    try{
      const response  = await axios.delete(`${BASE_URL}/interactions/deletenotification/${notificationId}`)

      if(response.data.success){
        toast.success("Notification Deleted Successfully")
      }
      else toast.error("Error occured in Deleting Notification, please try again after sometime")
    }
    catch(e){
      console.error("DeleteNotification error:", e.response?.data || e.message);
      toast.error("Error occured in Deleting Notification, please try again after sometime")
    }
  },
  ClearAllNotification : async()=>{
    try{
      const response  = await axios.delete(`${BASE_URL}/interactions/clearallnotification`)

      if(response.data.success){
        toast.success("All Notification's Cleared Successfully")
      }
      else toast.error("Error occured in clearing All Notification's, please try again after sometime")
    }
    catch(e){
      console.error("ClearAllNotification error:", e.response?.data || e.message);
      toast.error("Error occured in Clearing All Notification, please try again after sometime")
    }
  }
}));
