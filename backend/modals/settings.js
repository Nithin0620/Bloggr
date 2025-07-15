const mongoose = require("mongoose")

const settingsSchema = new mongoose.Schema({
  user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
   },
   mode:{
      type:String,
      enum:["dark","light"],
      default:"light",
   },
   theme:{
      type:String,
      default:"green",
   },
   pushNotification:{
      type:Boolean,
      default:true,
   },
   emailNotification:{
      type:Boolean,
      default:false,
   },
   homeFeedType:{
      type:String,
      default:"all",
   }
},{
   timestamps:true
})

module.exports = mongoose.model("Settings",settingsSchema);