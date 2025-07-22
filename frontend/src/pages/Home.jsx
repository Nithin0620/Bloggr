import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../store/AuthStore";
// import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import HeroCard from "../components/HeroCard";
import HomePostCards from "../components/HomePostCards";
import { useAuthStore } from "../store/AuthStore";
import { usePostStore } from "../store/PostStore";

const Home = () => {
  const dummyPosts = [
    {
      title: "Exploring AI in Modern Education",
      description:
        "Artificial Intelligence is transforming classrooms, from personalized tutoring to smart grading. Here's how educators can adapt to the evolving tech landscape.",
      image: "https://source.unsplash.com/featured/?ai,education",
      author: "John Doe",
      readTime: 5,
      updatedTime: Date.now() - 5 * 60 * 1000,
      likes: [1, 2, 3],
      comments: [1, 2],
      categories: ["AI", "Education", "Future", "Reccession", "Scope"],
    },
    {
      title: "Mastering the MERN Stack: A Beginner’s Guide",
      description:
        "The MERN stack (MongoDB, Express, React, Node.js) is one of the most popular web development stacks. This post helps you get started from scratch.",
      image: "https://source.unsplash.com/featured/?mern,code",
      author: "Jane Smith",
      readTime: 7,
      updatedTime: Date.now() - 20 * 60 * 1000,
      likes: [1],
      comments: [],
      categories: ["WebDev", "MERN"],
    },
  ];

  const { fetchCategories, categoriesList,posts } = usePostStore();

  useEffect(() => {
    fetchCategories(); // will update Zustand store
  }, [fetchCategories]);


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
              {categoriesList.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Post Section */}
        <div
          id="PostSection"
          className="grid grid-cols-1 min-h-screen sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post, index) => (
            <HomePostCards key={index} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
