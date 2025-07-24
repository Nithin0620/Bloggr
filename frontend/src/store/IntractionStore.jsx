import axios from "axios";
import { create } from "zustand";
import {toast} from "react-hot-toast"

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

  getAllPostLikedByCurrentUser: async () => {
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
      toast.error("Error occured in Clearing All Notification, please try again after sometime")
    }
  }
}));
