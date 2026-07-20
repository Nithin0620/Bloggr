const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser")
const cors = require("cors");

const {dbConnect}  = require("./configuration/dataBase")
const{cloudinaryConnect} = require("./configuration/cloudinary")

const {app,server} = require("./configuration/socket")

const healthRoutes = require("./routes/Health.routes")
const authRoutes = require("./routes/Auth.routes");
const categoryRoutes = require("./routes/Category.routes");
const interactionRoutes = require("./routes/Interactions.routes");
const messageRoutes = require("./routes/Message.routes")
const postRoutes = require("./routes/Post.routes");
const profileRoutes = require("./routes/Profile.routes");
const settingsRoutes = require("./routes/Settings.routes")
const bookmarkRoutes = require("./routes/Bookmark.routes")
const readingListRoutes = require("./routes/ReadingList.routes")
const tagRoutes = require("./routes/Tag.routes")
const path = require("path")

const PORT  = process.env.PORT || 5000;


app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' ,parameterLimit: 10000 }));
app.use(cookieParser());
app.use(cors({
  origin:`${process.env.ENVIRONMENT === "development"? "http://localhost:3000" : "https://bloggr-y7gx.onrender.com/"}`,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.static(path.join(__dirname, '../frontend/build')));


// Health check (no /api prefix — used by load balancers, k8s, etc.)
app.use("/health", healthRoutes);

// API v1 routes
const v1 = "/api/v1";
const legacy = "/api";
const routePairs = [
  ["/auth", authRoutes],
  ["/category", categoryRoutes],
  ["/interactions", interactionRoutes],
  ["/messages", messageRoutes],
  ["/post", postRoutes],
  ["/profile", profileRoutes],
  ["/settings", settingsRoutes],
  ["/bookmarks", bookmarkRoutes],
  ["/readinglists", readingListRoutes],
  ["/tags", tagRoutes],
];

routePairs.forEach(([path, router]) => {
  app.use(`${v1}${path}`, router);
  app.use(`${legacy}${path}`, router);
});


server.listen(PORT,()=>{
   console.log(`Server started at port No:- ${PORT} `);
   dbConnect();
   cloudinaryConnect();
})

app.get("/" , (req,res)=>{
  res.send(`<h1> This is homepage, response from server hance the server is up and running <h1/>`)
})

app.get(/^\/(?!api|health).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
});
