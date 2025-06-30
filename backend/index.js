const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser")
const cors = require("cors");

const {dbConnect}  = require("./configuration/dataBase")
const {app,server} = require("./configuration/socket")


const PORT  = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      origin: "http://localhost:3000",
      credentials:true
   })
);


server.listen(PORT,()=>{
   console.log(`Server started at port No:- ${PORT} `);
   dbConnect();
})

app.get("/",(req,res)=>{
   res.send(`<h1>The server is Up and running perfectly<h1/>`)
})