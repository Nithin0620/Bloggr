import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../store/AuthStore";
// import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import HeroCard from "../components/HeroCard";
import HomePostCards from "../components/HomePostCards";
import { useAuthStore } from "../store/AuthStore";
import { usePostStore } from "../store/PostStore";
import{Loader} from "lucide-react"
import { useIntractionStore } from "../store/IntractionStore";
import { useSettingsStore } from "../store/SettingsStore";

const Home = () => {

  const [liked,setLiked] = useState(false);

  const {getSettings} = useSettingsStore();


  
  const {authUser} = useAuthStore();
  const {getAllPostLikedByCurrentUser} = useIntractionStore();
  
  const { fetchCategories, categoriesList,posts,fetchPosts } = usePostStore();
  const [categories,setCategories] = useState([]);
  const [Post,setPost] = useState([]);
  const[loading , setLoading] = useState(false);

  useEffect(() => {

    const getSettingsOnRender = async()=>{
      // if(!token) return;
      // console.log("here in app")
      await getSettings();
      // console.log("response in app",response)
    }
    getSettingsOnRender();

    getAllPostLikedByCurrentUser();
    const fetchCategoryAndPostfromStore = async()=>{
      setLoading(true);
      const array = await fetchCategories();
      const PostArray = await fetchPosts();
      setPost(PostArray);
      setCategories(array);
      setLoading(false);
      setLiked(false);
      
    }
    fetchCategoryAndPostfromStore(); 
  }, [fetchCategories,categoriesList,fetchPosts,posts,liked]);


  // useEffect(() => {
  //   console.log("categories updated:", categoriesList);
  //   setCategories(categoriesList);
  //   console.log(categoriesList);
  // }, [categoriesList]);





  return (
    <div className="flex justify-center p-2 transition-colors duration-300 accent-bg-mode accent-text-mode">
      {/* Main Container */}
      <div className="w-[85%] rounded-3xl flex flex-col items-center px-12 py-2 min-h-screen shadow-accent-box border accent-border transition-colors duration-300 accent-bg-mode accent-text-mode">
        
        {/* Hero Section */}
        <HeroCard />

        {/* Search and Filter */}
        <div className="w-[98%] mx-auto rounded-xl shadow shadow-accent p-4 mt-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors duration-300 accent-bg-mode accent-text-mode">
          {/* 🔍 Search Bar */}
          <div className="flex items-center w-full md:w-[80%]  rounded-md px-4 py-2 shadow-inner accent-box-shadow border accent-border">
            <IoSearch className=" text-lg transition-colors duration-300 accent-bg-mode accent-text-mode" />
            <div className="mx-2 h-6 w-[1.5px] ml-4 transition-colors duration-300 bg-gray-400 accent-text-mode" ></div>
            <input
              type="search"
              placeholder="Search posts, authors or categories"
              className="ml-3 w-full bg-transparent text-sm outline-none  placeholder-gray-500"
            />
          </div>

          {/* ⬇️ Category Dropdown */}
          <div className="w-full md:w-[25%] transition-colors duration-300 accent-bg-mode accent-text-mode">
            <select className="w-full text-sm px-4 py-2 border accent-border rounded-md shadow-sm transition-colors duration-300 accent-bg-mode accent-text-mode">
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Post Section */}
       <div className="relative min-h-screen">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-cente z-10">
            <div >
              <Loader className="animate-spin" />
            </div>
          </div>
        )}

        <div
          id="PostSection"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Post.map((post, index) => (
            <HomePostCards key={index} post={post} setLiked={setLiked} />
          ))}
        </div>
      </div>
       
      </div>
    </div>
  );
};

export default Home;
