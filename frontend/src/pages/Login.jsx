import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import toast from "react-hot-toast"

const Login = () => {
   const navigate = useNavigate();
   const [email,setEmail] = useState('');
   const [password,setPassword] = useState('');

   const handleLogin = ()=>{
      if(!email){
         toast.error("Email id is required !");
         return;
      }
      if(!password){
         toast.error("please enter your password 🫣")
         return;
      }
   }

   const handleForgotPassword = ()=>{

   }


  return (
    <div className='flex flex-col justify-between'>
      <div className='flex h-[80%] place-items-center '>
         <div className='flex flex-col justify-evenly pt-4'>
            <h1 className='text-2xl font-bold'>
               Welcome Back
            </h1>
            <p className='font-serif text-sm opacity-95'>
               Sign in to continue to your Bloggr account.
            </p>
            <div className='flex flex-col justify-evenly'>
               <input   className='p-5 h-5 w-56 border-0 border-opacity-80 focus:border-opacity-100 placeholder:opacity-80 hover:placeholder:opacity-95'
                     type="text"
                     placeholder='Email ID'   
                     onChange={(e)=> setEmail(e.target.value)}
                     value={email}
               />
               <input className='p-5 h-5 w-56 border-0 border-opacity-80 focus:border-opacity-100 placeholder:opacity-80 hover:placeholder:opacity-95' 
                     type="text"
                     placeholder='Password'
                     onChange={(e)=> setPassword(e.target.value)}
                     value={password}
               />
            </div>
            <div>
               <button className='hover:font-semibold font-medium' onClick={handleForgotPassword}>
                  Forgot Password ?
               </button>
            </div>
            <div className='hover:scale-110 font-semibold text-lg' onClick={handleLogin}>
               Log in
            </div>
            <div className='flex justify-center'>
               <p className='font-light opacity-80 text-base'>Don't have a account?</p>
               <button className='font-medium hover:font-bold hover:scale-105' onClick={navigate("/signup")}>
                  Sign up
               </button>
            </div>
         </div>
      </div>
      <div className='h-[20%] m-4 opacity-90 font-serif'>
         © 2025 Bloggr. All rights reserved.
      </div>
    </div>
  )
}

export default Login
