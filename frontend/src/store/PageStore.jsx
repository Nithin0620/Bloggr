import {Create} from "zustand"

export const usePageStore = Create((get,set)=>({
   currentPage : homePage,
   setCurrentPage : async(page)=>{
      set({currentPage:page});
   }
}))