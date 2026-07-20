const mongoose = require("mongoose")
const {passwordResetMailTamplet} = require('../templates/emailVerificationTamplet.js')
const {sendEmail} = require("../utility/mailSender.js")
const logger = require("../configuration/logger");

const passwordResetOtpSchema = new mongoose.Schema({
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

const sendResetPasswordEmail = async(email,otp) =>{
   try{
      await sendEmail(
         email,
         "Reset Your Bloggr Password",
         passwordResetMailTamplet(otp)
      )
   }
   catch(e){
      logger.error("error in sending reset password email")
      logger.error(e);
   }
}

passwordResetOtpSchema.pre("save",async function(next){
   if(this.isNew){
      await sendResetPasswordEmail(this.email , this.otp)
   }
   next();
})

module.exports = mongoose.model("PasswordResetOTP",passwordResetOtpSchema);
