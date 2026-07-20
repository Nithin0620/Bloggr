const mongoose = require("mongoose")

const readingListSchema = new mongoose.Schema({
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
   },
   name:{
      type:String,
      required:true,
      trim:true,
   },
   description:{
      type:String,
      default:"",
      trim:true,
   },
   posts:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Post",
      }
   ],
   isPublic:{
      type:Boolean,
      default:false,
   }
},{
   timestamps:true
})

readingListSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ReadingList", readingListSchema);
