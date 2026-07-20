const mongoose = require("mongoose")


const commentSchema = new mongoose.Schema({
   post:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Post"
   },
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
   },
   text:{
      type:String,
      required:true,
   }
},{
   timestamps:true
})

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

module.exports = mongoose.model("Comment",commentSchema);