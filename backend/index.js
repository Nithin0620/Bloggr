const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser")
const cors = require("cors");

const {dbConnect}  = require("./configuration/dataBase")
const {app,server} = require("./configuration/socket")

const authRoutes = require("./routes/Auth.routes");
const categoryRoutes = require("./routes/Category.routes");
const interactionRoutes = require("./routes/Interactions.routes");
const messageRoutes = require("./routes/Message.routes")
const postRoutes = require("./routes/Post.routes");
const profileRoutes = require("./routes/Profile.routes");
const settingsRoutes = require("./routes/Settings.routes")

const PORT  = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
   cors({
      origin: "http://localhost:3000",
      credentials:true
   })
);


//Mounting API's
app.use("/api/auth",authRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/interactions",interactionRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/post",postRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/settings",settingsRoutes);


server.listen(PORT,()=>{
   console.log(`Server started at port No:- ${PORT} `);
   dbConnect();
})

app.get("/",(req,res)=>{
   res.send(`<h1>The server is Up and running perfectly<h1/>`)
})