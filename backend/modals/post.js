const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
   title:{
      type:String,
      required:true,
   },
   author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
   },
   content:{
      type:String,
      required:true,
   },
   categories:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Category",
      }
   ],
   likes:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
      }
   ],
   comments:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Comment",
      }
   ],
   image:{
      type:String,
   },
   views:{
      type: Number,
      default: 0 
   },
   readTime:{
      type:String,
   }
},{
   timestamps:true
}
)


module.exports = mongoose.model("Post" , postSchema);