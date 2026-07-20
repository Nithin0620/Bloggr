const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("./logger");


exports.dbConnect = ()=>{
   mongoose.connect(process.env.DATABASE_URL)
   .then(()=>{
      logger.info("Database connected");
   })
   .catch((e)=>{
      logger.error("Error occurred in DataBase Connection Process.");
      logger.error(e);
      process.exit(1);
   })
}

