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
   tags:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Tag",
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
   viewedBy:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
      }
   ],
   readTime:{
      type:String,
   },
   status:{
      type:String,
      enum:["published","scheduled","draft"],
      default:"published",
   },
   scheduledAt:{
      type:Date,
      default:null,
   },
   summary:{
      type:String,
      default:null,
   },
   sentimentScore:{
      type:Number,
      default:0,
   },
   sentimentUpdatedAt:{
      type:Date,
      default:null,
   },
   embeddingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
   },
   difficulty: {
      level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
      readingGrade: Number,
      vocabularyComplexity: String,
      technicalDensity: String,
   },
   seo: {
      score: Number,
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
   },
   summaries: {
      tldr: String,
      bulletPoints: [String],
      summary100: String,
      oneLiner: String,
   },
   trendingScore: {
      type: Number,
      default: 0,
   },
   podcast: {
      status: { type: String, enum: ["pending", "processing", "completed", "failed"], default: "pending" },
      script: [{ speaker: String, text: String }],
      audioUrl: String,
      duration: Number,
   },
},{
   timestamps:true
})

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, scheduledAt: 1 });
postSchema.index({ trendingScore: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ title: "text", content: "text" }, { weights: { title: 10, content: 5 } });

module.exports = mongoose.model("Post" , postSchema);