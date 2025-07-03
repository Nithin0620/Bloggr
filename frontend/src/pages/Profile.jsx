import React from 'react'
import { useAuthStore } from '../store/AuthStore'

const Profile = () => {

   const authUser = useAuthStore();


  return (
   <div >
      {/* profile wala component */}
      <div className='mt-10 mb-10 shadow-[0px_4px_24px_0px_rgba(0,_0,_0,_0.3)]'>
         {/* round image wala div */}
         <div className='w-[20%] flex items-start'>
            <div>
               <img src={authUser.profilePic} alt="" className='rounded-full w-52 aspect-square'/>
            </div>
         </div>

         {/* details wala compo */}
         <div>
            <h1>{authUser.firstName} {authUser.lastName}</h1>
            <p>{authUser.profession}</p>
            <p>joined in {authUser.createdAt}</p>

            <p>
               {authUser.description}
            </p>
            
            <button>
               Follow {authUser.firstName}
            </button>
         </div>

         {/* stand alone ek border jasa line */}
         <div className='w-0 h-80'></div>

         {/*followrs and folloing container*/}
         <div className='w-[20%] flex items-start p-10'>
            <div className='mb-5'>
               <p className='font-bold'>{authUser.profile.followers}</p>
               <p className='font-medium'>Followers</p>
            </div>
            <div>
               <p className='font-bold'>{authUser.profile.following}</p>
               <p className='font-medium'>Following</p>
            </div>
         </div>
      </div>

      <div>
         <h1>Posts</h1>
         <div className='w-10'></div>
      </div>

      <div>
         
      </div>
   </div>
  )
}

export default Profile
