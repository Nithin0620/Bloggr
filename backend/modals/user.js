const mongoose = require("mongoose")
const {welcomeMailTemplate} = require('../tamplets/OnboardingEmail.js')
const {sendEmail} = require("../utility/mailSender.js")


const userSchema = new mongoose.Schema({
   firstName:{
      type:String,
      required:true,
   },
   lastName:{
      type:String,
      required:true,
   },
   email:{
      type:String,
      required:true,
      unique:true,
   },
   password:{
      type:String,
      required:true,
   },
   profilePic:{
      type:String,
      default:"",
   },
   token:{
      type:String,
   },
   profile:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Profile",
   }
},
{
   timestamps:true
})




const sendOnboardingEmail = async(email,firstName) =>{
   try{
      const mailresponse = await sendEmail(
         email,
         "Onboard Welcome e-mail",
         welcomeMailTemplate(firstName)
      )
   }
   catch(e){
      console.log("error in calling the mailSender function inside the user.js modal")
      console.log(e);
   }
}



userSchema.pre("save",async function(next){
   if(this.isNew){
      await sendOnboardingEmail(this.email , this.firstName)
   }
   next();
})



module.exports = mongoose.model("User" , userSchema)