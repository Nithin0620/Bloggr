const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser")
const cors = require("cors");

const {dbConnect}  = require("./configuration/dataBase")
const{cloudinaryConnect} = require("./configuration/cloudinary")
const logger = require("./configuration/logger")
const errorHandler = require("./middlewares/errorHandler")

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
const aiRoutes = require("./routes/AI.routes")
const searchRoutes = require("./routes/Search.routes")
const readerAssistantRoutes = require("./routes/ReaderAssistant.routes")
const ragChatRoutes = require("./routes/RagChat.routes")
const analyticsRoutes = require("./routes/Analytics.routes")
const podcastRoutes = require("./routes/Podcast.routes")
const path = require("path")

const PORT  = process.env.PORT || 5000;

const passport = require("./configuration/passport");

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' ,parameterLimit: 10000 }));
app.use(cookieParser());
app.use(passport.initialize());
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
  ["/ai", aiRoutes],
  ["/search", searchRoutes],
  ["/reader", readerAssistantRoutes],
  ["/ragchat", ragChatRoutes],
  ["/analytics", analyticsRoutes],
  ["/podcast", podcastRoutes],
];

routePairs.forEach(([routePath, router]) => {
  app.use(`${v1}${routePath}`, router);
  app.use(`${legacy}${routePath}`, router);
});

// Global error handler (must be after all routes)
app.use(errorHandler);


const { initQdrantCollection } = require("./configuration/qdrant");
const { startEmbeddingWorker } = require("./workers/embeddingWorker");
const { startPipelineWorker } = require("./workers/pipelineWorker");

server.listen(PORT,()=>{
   logger.info(`Server started on port ${PORT}`);
   dbConnect();
   cloudinaryConnect();
   initQdrantCollection().catch((err) => console.warn("Qdrant init warning:", err.message));
   try { startEmbeddingWorker(); } catch (err) { console.warn("Embedding worker warning:", err.message); }
   try { startPipelineWorker(); } catch (err) { console.warn("Pipeline worker warning:", err.message); }
})

app.get("/" , (req,res)=>{
  res.send(`<h1> This is homepage, response from server hance the server is up and running <h1/>`)
})

app.get(/^\/(?!api|health).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
});
