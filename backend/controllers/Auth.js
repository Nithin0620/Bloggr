const User = require("../modals/user")
const OTP = require("../modals/otp")
const bcrypt = require("bcrypt")
const gravatar = require('gravatar');

export const signup = async(req,res)=>{
   try{
      const {firstName , lastName , email , password , confirmPassword , agreetermsofservice , otp} = req.body;

      if(!firstName || !lastName || !email || !password || !confirmPassword || !agreetermsofservice ,!otp){
         return res.status(403).json({
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

      const existingUser = await User.findOne({email:email});
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: "User already exist's",
         });
      }
      const recentOtp = await OTP.findOne({emai:email}).sort({createdAt:-1}).limit(1);
      if(recentOtp.length === 0){
         return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
         })
      }
      else if(recentOtp.otp !== otp){
         return res.status(400).json({
            success:false,
            message:"Invalid OTP",
         })
      }
      const hashedPassword = await bcrypt.hash(password , 10);
      const profilePic = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

      const payload = {firstName , lastName , email , hashedPassword , profilePic}
      const response = await User.create(payload);

      if(!response) {
         throw new Error("Error occured in creating new User")
      }
      
      return res.status(200).json({
         success:true,
         message:"User created Successfully",
         data:response,
      })      
   }
   catch(e){
      return res.status(500).json({
         success:false,
         message:"Error occured in the backend in the Signup controller", 
      })
   }
}