const User = require("../modals/user")
const OTP = require("../modals/otp")

export const signup = ({firstName , lastName , email , password , confirmPassword , agreetermsofservice})=>{
   try{
      if(!firstName , !lastName , !email , !password , !confirmPassword , !agreetermsofservice){
         return res.status(400).json({
            success:false,
            message:"All fields are required",
         })
      }

      if(password !== confirmPassword){
         return res.status(400).json({
            success:false,
            message:"password and Confirm Password does not match",
         })
      }
   }
   catch(e){

   }
}