import {create} from "zustand"
import axios from "axios"
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api" : "/api";

export const useProfileStore = create((get,set)=>({
   UserProfile : null,

   fetchUserProfile : async(userId)=>{
      try{
         const response = await axios(`${BASE_URL}/profile/viewuserprofile/${userId}`);
         console.log("Reaspone",response)
         set({UserProfile:response.data})
         return response.data;
      }
      catch(e){
         console.log("error in the fetchUser profile function:",e);
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
         console.log(e);
         toast.error("Error occured in updating your profile")
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
         console.log(e);
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
         console.log(e);
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
         console.log(e);
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
         // console.log(e);
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
            withCredentials: true, // if using cookies for auth
         });

         if(response.data.success){
            toast.success("Profile photo updated successfully!")
         }else{
            toast.error("an error occured in updating profile photo!");
         }
      }
      catch(e){
         // console.log(e);
         toast.error("an error occured in updating profile photo!");
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
         // console.log(e);
         toast.error("an error occured in Deleting profile photo!");
      }
   },


}))