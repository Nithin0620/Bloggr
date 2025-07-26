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
      default:"Blue",
   },
   pushNotification:{
      type:Boolean,
      default:true,
   },
   emailNotification:{
      type:Boolean,
      default:true,
   },
   homeFeedType:{
      type:Array,
      default:"All",
   }
},{
   timestamps:true
})

module.exports = mongoose.model("Settings",settingsSchema);