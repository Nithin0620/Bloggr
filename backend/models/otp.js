const mongoose = require("mongoose")
const {verificationMailTamplet} = require('../templates/emailVerificationTamplet.js')
const {sendEmail} = require("../utility/mailSender.js")
const logger = require("../configuration/logger");

const otpSchema = new mongoose.Schema({
   email:{
      type:String,
      required:true
   },
   otp:{
      type:String,
      required:true,
   },
   createdAt : {
      type:Date,
      default:Date.now,
      expires:5*60,
   }
})


const sendVerificationEmail = async(email,otp) =>{
   try{
      const mailresponse = await sendEmail(
         email,
         "verification Email",
         verificationMailTamplet(otp)
      )
   }
   catch(e){
      logger.error("error in calling the mailSender function inside the otp.js modal")
      logger.error(e);
   }
}



otpSchema.pre("save",async function(next){
   if(this.isNew){
      await sendVerificationEmail(this.email , this.otp)
   }
   next();
})


module.exports = mongoose.model("OTP",otpSchema);




