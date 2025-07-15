import React from 'react'
import { useAuthStore } from '../store/AuthStore'
import ProfilePostCard from '../components/ProfilePostCard';

const Profile = () => {
  const authUser = useAuthStore();

   const dummyProfilePosts = [
      {
         title: "The Future of AI in Software Development",
         description:
            "A deep dive into how artificial intelligence is reshaping the landscape of software engineering, from code generation to automated testing.",
         image: "https://source.unsplash.com/80x80/?ai,software",
         author: { _id: "user123", name: "Nithin KS" },
         readTime: 4,
         updatedTime: Date.now() - 6 * 60 * 1000, // 6 minutes ago
         likes: [1, 2, 3],
         comments: [1],
         categories: ["Tech"]
      },
      {
         title: "React vs Vue: Choosing the Right Framework",
         description:
            "When starting a new project, picking the right JavaScript framework is critical. This article explores the pros and cons of React and Vue for beginners and pros alike.",
         image: "https://source.unsplash.com/80x80/?javascript,react",
         author: { _id: "user123", name: "Nithin KS" },
         readTime: 6,
         updatedTime: Date.now() - 15 * 60 * 1000, // 15 minutes ago
         likes: [1, 2],
         comments: [],
         categories: ["Frontend", "JS"]
      },
      {
         title: "Mastering MongoDB Aggregations",
         description:
            "MongoDB’s aggregation pipeline is a powerful tool for data manipulation. This post explains how to use match, group, project, and sort stages effectively.",
         image: "https://source.unsplash.com/80x80/?database,mongodb",
         author: { _id: "user456", name: "Alex Morgan" },
         readTime: 8,
         updatedTime: Date.now() - 60 * 60 * 1000, // 1 hour ago
         likes: [],
         comments: [1, 2, 3, 4],
         categories: ["Database", "Backend"]
      }
   ]


  return (
    <div className="flex justify-center mx-auto px-4 py-5">
      {/* Profile Card */}
      <div className='w-[85%] rounded-lg p-8 bg-slate-100'>
         <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-start justify-between">
         {/* Left - Image and Basic Info */}
         <div className="flex items-start gap-6 w-full md:w-auto">
            <img
               src={authUser.profilePic}
               alt="profile"
               className="rounded-full w-24 h-24 md:w-28 md:h-28 object-cover"
            />
            <div>
               <h1 className="text-xl font-semibold">{authUser.firstName} {authUser.lastName}</h1>
               <p className="text-sm text-gray-600">{authUser.profession}</p>
               <p className="text-sm text-gray-500">Joined in {authUser.createdAt}</p>
               <p className="mt-2 text-sm text-gray-700">{authUser.description}</p>
               <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-4 rounded-md">
               Follow {authUser.firstName}
               </button>
            </div>
         </div>

         {/* Divider - only on large screen */}
         <div className="hidden md:block w-px bg-gray-300 mx-6 h-24"></div>

         {/* Right - Followers */}
         <div className="flex md:flex-col items-center gap-6 mt-6 md:mt-0 w-full md:w-auto justify-around">
            <div className="text-center">
               <p className="text-xl font-bold">{authUser.profile}</p>
               <p className="text-sm font-medium text-gray-600">Followers</p>
            </div>
            <div className="text-center">
               <p className="text-xl font-bold">{authUser.profile}</p>
               <p className="text-sm font-medium text-gray-600">Following</p>
            </div>
         </div>
         </div>

         {/* Posts Section */}
         <div className="mt-10">
         <h2 className="text-lg font-semibold border-b-2 border-blue-500 inline-block pb-1">Posts</h2>

         <div className="mt-6 space-y-6">
            
            {dummyProfilePosts.map((post, index) => (
               <ProfilePostCard key={index} post={post} />
            ))}
            
         </div>

           
         </div>
         </div>
      </div>
  )
}

export default Profile
