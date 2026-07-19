const mongoose = require("mongoose")
const {passwordResetMailTamplet} = require('../tamplets/emailVerificationTamplet.js')
const {sendEmail} = require("../utility/mailSender.js")

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
      console.log("error in sending reset password email")
      console.log(e);
   }
}

passwordResetOtpSchema.pre("save",async function(next){
   if(this.isNew){
      await sendResetPasswordEmail(this.email , this.otp)
   }
   next();
})

module.exports = mongoose.model("PasswordResetOTP",passwordResetOtpSchema);
