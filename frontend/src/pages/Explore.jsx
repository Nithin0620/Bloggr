import React from 'react'
import Trending from "../components/Trending"
import ArroundTheWorld from "../components/ArroundTheWorld"
import Bloggrs from "../components/Bloggrs"

const Explore = () => {
   return (
      <div className='min-h-screen flex flex-col md:flex-row gap-4 px-2 pt-2 accent-bg-mode accent-text-mode'>
         <div className='md:w-[35%] w-full h-screen overflow-y-auto custom-scroll shadow-accent-box p-3 rounded-2xl bg-card-mode'>
            <h1 className='text-xl font-bold  accent-text mb-4'>🔥 <span className='accent-underline'>Trending Posts on Bloggr</span></h1>
            <Trending />
         </div>

         <div className='md:w-[53%]  w-full h-screen overflow-y-auto custom-scroll shadow-accent-box p-2 rounded-2xl bg-card-mode'>
            <h1 className='text-xl font-bold accent-text mb-4'>🌍 <span className='accent-underline'>Blogs Around the World</span></h1>
            <ArroundTheWorld />
         </div>

         <div className='md:w-[10%]  w-full h-screen overflow-y-auto custom-scroll  overflow-x-hidden shadow-accent-box p-3 rounded-2xl bg-card-mode'>
            <h1 className='text-xl font-bold  accent-text mb-4 overflow-x-hidden'><span className='accent-underline'>Bloggr's Family</span>🫂</h1>
            <Bloggrs />
         </div>
      </div>
   )
}

export default Explore
