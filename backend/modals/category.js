const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      unique: true
   },
   posts:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Post",
      }
   ]
});


module.exports = mongoose.model("Category" , categorySchema);