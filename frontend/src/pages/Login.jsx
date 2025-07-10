import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email) {
      toast.error("Email id is required !");
      return;
    }
    if (!password) {
      toast.error("Please enter your password 🫣");
      return;
    }
  };

  const handleForgotPassword = () => {
    // your forgot password logic
  };

  return (
    <div className="h-[90%] mt-5 flex flex-col gap-16 items-center justify-start">
      
      {/* Main Login Card */}
      <div className="flex items-center justify-center w-full mt-10 ">
         <div className="bg-white rounded-xl shadow-md px-10 py-8 w-[95%] max-w-sm flex flex-col gap-4">
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-sm opacity-80 font-serif">Sign in to continue to your Bloggr account.</p>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/20 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black/20 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              onClick={handleForgotPassword}
              className="text-sm hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-2 rounded-md font-semibold hover:scale-[1.02] transition bg-black text-white"
          >
            Log in
          </button>

          {/* Signup Redirect */}
          <div className="text-center text-sm mt-2">
            <span className="opacity-80">Don't have an account? </span>
            <button
              onClick={() => navigate("/signup")}
              className="font-medium hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs opacity-70 font-serif ">
        © 2024 Bloggr. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
