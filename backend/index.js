const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser")
const cors = require("cors");

const {dbConnect}  = require("./configuration/dataBase")
const{cloudinaryConnect} = require("./configuration/cloudinary")

const {app,server} = require("./configuration/socket")

const authRoutes = require("./routes/Auth.routes");
const categoryRoutes = require("./routes/Category.routes");
const interactionRoutes = require("./routes/Interactions.routes");
const messageRoutes = require("./routes/Message.routes")
const postRoutes = require("./routes/Post.routes");
const profileRoutes = require("./routes/Profile.routes");
const settingsRoutes = require("./routes/Settings.routes")
const path = require("path")

const PORT  = process.env.PORT || 5000;


app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' ,parameterLimit: 10000 }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.static(path.join(__dirname, '../frontend/build')));


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
   cloudinaryConnect();
})

app.get("/" , (req,res)=>{
  res.send(`<h1> This is homepage, response from server hance the server is up and running <h1/>`)
})

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
});