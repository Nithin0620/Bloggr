import {create} from "zustand"

export const usePageStore = create((get,set)=>({
   currentPage : "homePage",
   setCurrentPage : async(page)=>{
      set({currentPage:page});
   }
}))