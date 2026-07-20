import {create} from "zustand"
import axios from "axios"
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api/v1" : "/api/v1";

export const useProfileStore = create((set,get)=>({
   UserProfile : null,

   fetchUserProfile : async(userId)=>{
      try{
         const response = await axios(`${BASE_URL}/profile/viewuserprofile/${userId}`);
         set({UserProfile:response.data})
         return response.data;
      }
      catch(e){
         console.error("fetchUserProfile error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "Failed to load profile");
         return [];
      }
   },

   editProfileInfo : async(data)=>{
      try{
         const response = await axios.put(`${BASE_URL}/profile/updateprofileinfo`,data);
         if(response.data.success){
            toast.success("Profile Updated Successfully");
         }
         else{
            toast.error("Error occured in updating your profile")
         }
      }
      catch(e){
         console.error("editProfileInfo error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "Error occured in updating your profile")
      }
   },
   Followuser : async(id)=>{
      try{
         const response = await axios.put(`${BASE_URL}/profile/followuser/${id}`);
         if(response.data.success){
            toast.success("Profile Followed Successfully");
         }
         else{
            toast.error("Error occured in Follwing this profile")
         }
      }
      catch(e){
         console.error("Followuser error:", e.response?.data || e.message);
         toast.error("Error occured in Following this profile")
      }
   },
   unFollowUser : async(id)=>{
      try{
         const response = await axios.put(`${BASE_URL}/profile/unfollowuser/${id}`);
         if(response.data.success){
            toast.success("Profile unFollowed Successfully");
         }
         else{
            toast.error("Error occured in unFollwing this profile")
         }
      }
      catch(e){
         console.error("unFollowUser error:", e.response?.data || e.message);
         toast.error("Error occured in unFollowing this profile")
      }
   },
   getFollowers :async(id)=>{
      try{
         const response = await axios.get(`${BASE_URL}/profile/getfollowerslist/${id}`);

         if(response.data.success){
            return response.data.data;
         }
         else return [];
      }
      catch(e){
         console.error("getFollowers error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "Failed to load followers");
         return [];
      }
   },
   getFollowings :async(id)=>{
      try{
         const response = await axios.get(`${BASE_URL}/profile/getfollowinglist/${id}`);

         if(response.data.success){
            return response.data.data;
         }
         else return [];
      }
      catch(e){
         console.error("getFollowings error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "Failed to load followings");
         return [];
      }
   },
   updateProfilePic : async(formData)=>{
      try{
         const response = await axios.post(`${BASE_URL}/profile/uploadprofilepic`,formData,
         {
            headers: {
               "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
         });

         if(response.data.success){
            toast.success("Profile photo updated successfully!")
         }else{
            toast.error("an error occured in updating profile photo!");
         }
      }
      catch(e){
         console.error("updateProfilePic error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "an error occured in updating profile photo!");
      }
   },
   deleteProfilePic : async()=>{
      try{
         const response = await axios.delete(`${BASE_URL}/profile/deleteprofilepic`,);

         if(response.data.success){
            toast.success("Profile photo Deleted successfully!")
         }else{
            toast.error("an error occured in Deleting profile photo!");
         }
      }
      catch(e){
         console.error("deleteProfilePic error:", e.response?.data || e.message);
         toast.error(e.response?.data?.message || "an error occured in Deleting profile photo!");
      }
   },


}))
