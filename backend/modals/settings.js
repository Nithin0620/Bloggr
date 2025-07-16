const mongoose = require("mongoose")

const settingsSchema = new mongoose.Schema({
  user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
   },
   mode:{
      type:String,
      enum:["Dark","Light"],
      default:"Light",
   },
   theme:{
      type:String,
      default:"Green",
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
      default:"All",
   }
},{
   timestamps:true
})

module.exports = mongoose.model("Settings",settingsSchema);