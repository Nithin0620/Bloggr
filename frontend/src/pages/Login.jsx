import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from '../store/AuthStore';
import { usePageStore } from '../store/PageStore';
import {Loader} from "lucide-react"

const Login = () => {
  const {setCurrentPage} = usePageStore();
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
    setCurrentPage("home");
    // Add your login logic here
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
                  <Loader/>
                </div>) : (<div>
                  Log in
                </div>)
              }
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-1 text-xs text-gray-400">
            <div className="flex-1 h-[1px] accent-bg-dark"></div>
            <span>OR</span>
            <div className="flex-1 h-[1px] accent-bg-dark"></div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="flex flex-col gap-2">
            <a
              href={`${process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"}/auth/google`}
              className="w-full py-2 px-4 border accent-border rounded-md text-xs font-semibold flex items-center justify-center gap-2 hover:accent-bg-light transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </a>

            <a
              href={`${process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"}/auth/facebook`}
              className="w-full py-2 px-4 border accent-border rounded-md text-xs font-semibold flex items-center justify-center gap-2 hover:accent-bg-light transition text-blue-600 dark:text-blue-400"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </a>
          </div>

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
