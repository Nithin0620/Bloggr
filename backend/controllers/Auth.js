const User = require("../modals/user")
const OTP = require("../modals/otp")
const bcrypt = require("bcrypt")
const gravatar = require('gravatar');
const otpGenerator = require("otp-generator");
const Profile = require("../modals/profile")
const jwt = require("jsonwebtoken");
// const Settings = require("../modals/settings");

exports.signup = async(req,res)=>{
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
      const recentOtp = await OTP.findOne({email:email}).sort({createdAt:-1}).limit(1);
      if(recentOtp && recentOtp.length === 0){
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

      const profilePayload = {
         name: firstName+" "+lastName,
         bio:"Hi i am a new User to Bloggr and i would like to connect with you all",
      }

      const Profileresponse = await Profile.create(profilePayload);

      const hashedPassword = await bcrypt.hash(password , 10);
      const profilePic = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

      const payload = {firstName , lastName , email , password:hashedPassword , profilePic, profile:Profileresponse._id}
      const response = (await User.create(payload)).populate("profile");

      // const settingsResponse = await Settings.create({user:response._id});

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
      console.log(e);
      return res.status(500).json({
         success:false,
         message:"Error occured in the backend in the Signup controller", 
      })
   }
}

exports.login = async(req,res)=>{
   try{
      const {email,password}= req.body;

      if(!email || !password){
         return res.status(400).json({
            success:false,
            message:"All fields are required",
         })
      }

      const user = await User.findOne({email:email}).populate("profile").exec();
      if(!user){
         return res.status(400).json({
            success:false,
            message:"unable to find the user with this email",
         })
      }

      const compared = bcrypt.compare(password,user.password);
      if(compared){
         const payload={
            email:user.email,
            userId:user._id,
         }

         const Token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
         })

         user.token = Token;
         user.password = undefined;

         const options = {
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
         }

         res.cookie("jwt",Token,{
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
            secure:false,
            sameSite:"lax",
         }).status(200).json({
            success:true,
            Token,
            data:user,
            message:"Login successfull",
         })
      }else{
            return res.status(500).json({
            success: false,
            message: "Password is incorrect",
         });
      }
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         success: false,
         message: "Error occured in login controller",
      });
   }
};

exports.sendOtp = async(req,res)=>{
   try{
      const {email} = req.body;

      const checkUserPresent = await User.findOne({email:email});

      if(checkUserPresent){
         return res.status(401).json({
            success:false,
            message:"User already registered",
         })
      }

      var otp = otpGenerator.generate(6,{
         upperCaseAlphabets:false,
         lowerCaseAlphabets:false,
         specialChars:false,
      })

      var result = await OTP.findOne({otp:otp});

      while(result){
         otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
         })

         result = await OTP.findOne({otp:otp});
      }

      const otpBody = await OTP.create({email,otp});

      return res.status(200).json({
         success:true,
         otp:otpBody,
         message:"Otp sent successfully",
      })
   }
   catch (e) {
      console.log(e);
      return res.status(500).json({
         success: false,
         message: e.message,
      });
   }
}

exports.logout = (req, res) => {
  try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ success:true,message: "Logged out successfully" });
   }
   catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({success:false, message: "Internal Server Error" });
   }
};
