import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from '../store/AuthStore';
import { ImSpinner3 } from "react-icons/im";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login,setnavigate,isLoggingin} = useAuthStore();

  const handleLogin = () => {
    if (!email) {
      toast.error("Email id is required !");
      return;
    }
    if (!password) {
      toast.error("Please enter your password 🫣");
      return;
    }
    setnavigate(navigate);
    login({email,password});
    // Add your login logic here
  };

  const handleForgotPassword = () => {
    // your forgot password logic
  };

  return (
    <div className="min-h-screen flex flex-col gap-16 items-center justify-start transition-colors duration-300 accent-bg-mode accent-text-mode pt-[4.75rem]">
      
      <div className="flex items-center justify-center w-[95%] ax-w-md transition-colors duration-300 accent-bg-mode accent-text-mode">
        <div className=" rounded-xl shadow-md px-10 py-8 w-[95%] max-w-sm flex flex-col gap-4 accent-border border transition-colors duration-300 accent-bg-mode accent-text-mode">
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1 accent-text">Welcome back</h1>
            <p className="text-sm opacity-80 font-serif accent-text">Sign in to continue to your Bloggr account.</p>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 border accent-border rounded-md outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm transition-colors duration-300 accent-bg-mode accent-text-mode"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border accent-border rounded-md outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm transition-colors duration-300 accent-bg-mode accent-text-mode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              onClick={handleForgotPassword}
              className="text-sm font-medium accent-underline hover:opacity-90"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-2 rounded-md font-semibold hover:scale-[1.02] transition accent-bg text-white"
          >
            {
                isLoggingin ? (<div className='flex justify-center items-center accent-text-mode animate-spin'>
                  <ImSpinner3/>
                </div>) : (<div>
                  Log in
                </div>)
              }
          </button>

          {/* Signup Redirect */}
          <div className="text-center text-sm mt-2">
            <span className="opacity-80">Don't have an account? </span>
            <button
              onClick={() => navigate("/signup")}
              className="font-medium  accent-underline hover:opacity-90"
            >
              Signup
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs opacity-70 font-serif accent-text">
        © 2024 Bloggr. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
