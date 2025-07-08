const jwt = require("jsonwebtoken");
const User = require("../modals/user")
require("dotenv").config();

exports.protectRoute = async(req,res,next)=>{
   try{
      const token = req.cookies.jwt;

      if(!token){
         return res.status(401).json({
            success:false,
            message:"Unauthorised - No token Provided",
         })
      }

      const decoded = jwt.verify(token , process.env.JWT_SECRET);

      if(!decoded){
         return res.status(401).json({success:false,message:"Unauthorised - Invalid Token"});
      }

      const user = await User.findById(decoded.userId).select("-password");
      
      if(!user) return res.status(404).json({success:false,message:"User not Found"});
   
      req.user = user;

      next();
   }
   catch(e){
      console.log("Error in protection route in middleware",e.message);
      res.status(500).json({success:false,message:"Error occured in the middlware in the protection middleware"});
   }
}

