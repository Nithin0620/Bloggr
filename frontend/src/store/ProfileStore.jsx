import {create} from "zustand"
import axios from "axios"

const BASE_URL = "http://localhost:4000/api"

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
   }
}))