const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
   name:{
      type:String,
      default:"",
   },
   bio:{
      type:String,
      default:"",
   },
   followers:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:User,
   }],
   following:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:User,
   }],
   posts:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:Post,
   }],
   theme:{
      type:String,
      default:"light",
   },
   accent:{
      type:String,
      default:"green",
   }
})


module.exports = mongoose.model("Profile",profileSchema)