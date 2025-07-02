import React from "react";
import { useForm } from "react-hook-form";
import { PiEyeSlash } from "react-icons/pi";
import { IoEyeSharp } from "react-icons/io5";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = (data) => {

  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex h-[80%] place-items-center ">
        <div className="flex flex-col justify-evenly pt-4">
            <h1 className="text-2xl font-bold">Create Your Account</h1>
            <p className="font-serif text-sm opacity-95">
               Join Bloggr and start sharing your thoughts.
            </p>

            <form onSubmit={handleSubmit(handleSignUp)}>
               
               <div>
                  <input
                     className=""
                     type="text"
                     placeholder="First name"
                     {...register("firstName", { required: true })}
                  />
                  {
                     errors.firstName && (<div className="text-sm text-red-500 mt-1">
                        First Name is required 
                     </div>)
                  }
               </div>
               
               <div>
                  <input
                     className=""
                     type="text"
                     placeholder="Last name"
                     {...register("lastName", { required: true })}
                  />
                  {
                     errors.lastName && (<div className="text-sm text-red-500 mt-1">
                        *Last Name is required 
                     </div>)
                  }
               </div>

               <div>
                  <input
                     className=""
                     type="email"
                     placeholder="email@gmail.com"
                     {...register("email", { required: true })}
                  />
                  {
                     errors.email && (<div className="text-sm text-red-500 mt-1">
                        *Email Id is required 
                     </div>)
                  }
               </div>

               <div>
                  <div>
                     <div>
                        <input
                           className=""
                           type={showPassword ? "text" : "password"}
                           placeholder="Password"
                           {...register("password", { required: true })}
                        />
                        
                        <div onClick={() => setShowPassword(!showPassword)}>
                           {showPassword ? <PiEyeSlash /> : <IoEyeSharp />}
                        </div>
                     </div>
                     {
                        errors.password && (<div className="text-sm text-red-500 mt-1">
                           *This field is required 
                        </div>)
                     }
                  </div>
                  <div>
                     <div>
                        <input
                           className=""
                           type={showConfirmPassword ? "text" : "password"}
                           placeholder="Confirm Password"
                           {...register("confirmPassword", { required: true })}
                        />
               
                        <div
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                           {showConfirmPassword ? <PiEyeSlash /> : <IoEyeSharp />}
                        </div>
                     </div>
                     {
                        errors.confirmPassword && (<div className="text-sm text-red-500 mt-1">
                           *this field is required 
                        </div>)
                     }
                  </div>
               </div>

               <div>
                  <div>
                     <input
                        type="checkbox"
                        {...register("agreetermsofservice", { required: true })}
                     />
                     <p>I agree to the </p>
                     <p>Terms of Service</p>
                  </div>
                  {
                     errors.agreetermsofservice && (<div className="text-sm text-red-500 mt-1">
                        *this field is required 
                     </div>)
                  }
               </div>

               <button type="submit">Sign Up</button>
            </form>

            <div className='flex justify-center'>
               <p className='font-light opacity-80 text-base'>Already have an Account?</p>
               <button className='font-medium hover:font-bold hover:scale-105' onClick={navigate("/login")}>
                  Log in
               </button>
            </div>
        </div>
      </div>
      <div className="h-[20%] m-4 opacity-90 font-serif">
         © 2025 Bloggr. All rights reserved.
      </div>
    </div>
  );
};

export default Signup;
