import { create } from "zustand";
import axios from "axios";
import {toast} from "react-hot-toast"

const BASE_URL = "http://localhost:4000/api"


export const usePostStore = create((get,set)=>({
  createPostLoading : false,

  readMorePostData:null,
  isReadMoreLoading:false,
  categoriesList: [],

  posts:[],

  setPosts : async()=>{

  },

  fetchCategories: async () => {
    set({createPostLoading:true});
    try{
      const res = await axios.get(`${BASE_URL}/category/getallcategory`);
      
     if (res.data.success) {
        const categoryArray = res.data.data.map(category => category.name);
        set({ categoriesList: categoryArray });
        return categoryArray;
      }

      // console.log(get().categoryList)
    }
    catch(e){
      console.log(e);
      return [];
    }
  },

  // getCategories : ()=>{
  //   return get().categoriesList;
  // },

  fetchPosts : async()=>{
    set({fetchPostLoading:true});
    try{
      const response =  await axios.get(`${BASE_URL}/post/getallposts`);
      // console.log("response",response.data.data);
      set({posts:response.data.data})
      return response.data.data;
      // console.log(get().posts);
    }
    catch(e){
      console.log(e);
      return [];
    }
    finally{
      set({fetchPostLoading:false});

    }
  },

  getPostByID : async(postId)=>{
    set({isReadMoreLoading:true});
    try{
      // console.log("in the store")
      const response =  await axios.get(`${BASE_URL}/post/getpostbyid/${postId}`);
      console.log("response in the from id:",response.data.data);
      set({readMorePostData:response.data.data})
      return response.data.data;
      // console.log(get().posts);
    }
    catch(e){
      console.log(e);
      return [];
    }
    finally{
      set({isReadMoreLoading:false});
    }
  },

  getComments : async(id)=>{
    try{
      const response = await axios.get(`${BASE_URL}/interactions/getcomments/${id}`)
      console.log("comments,:" , response.data);
      return response.data;
    }
    catch(e){
      console.log(e)
      return [];
    }
  },

  createPost: async (formData) => {
    set({createPostLoading:true});
    try{
      const res = await axios.post(
        `${BASE_URL}/post/createpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let Axios handle boundary
          },
          withCredentials: true, // if using cookies for auth
        }
      );
      console.log(res)
      if(res.data.success){
        toast.success("New Blog posted successfully.")
      }
      else{
        toast.error("Error occured in posting the Blog!")
        toast("please Try again after sometime!")
      }
    }
    catch(e){
      console.log(e)
      toast.error("Error occured in posting the Blog!",e.message)
    }
    finally{
      set({createPostLoading:false});

    }
  },
  setPost : async(postId)=>{
    const response = 
    set({currentPostForReadMore:response})
  }
}))   