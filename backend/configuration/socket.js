const express = require("express")
const http = require("http");
const {Server} = require("socket.io")
require("dotenv").config();
// console.log("in the socket page ");

const app = express();
const server =http.createServer(app);


const defaultOrigins = [
   "http://localhost:3000",
   "https://bloggr-y7gx.onrender.com",
   "https://bloggrplatform.pages.dev",
   "https://bloggr.devnithin.xyz",
   "http://bloggr.devnithin.xyz",
   "https://bloggr.aws.devnithin.xyz",
   "http://bloggr.aws.devnithin.xyz",
   "http://bloggr.aws.devnithin.xyz:3000",
   "http://18.233.6.248:3000",
];

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];
if (process.env.FRONTEND_URL) {
  envOrigins.push(process.env.FRONTEND_URL.trim());
}

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const io = new Server(server,{
   cors : {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed =
          allowedOrigins.includes(origin) ||
          /\.devnithin\.xyz(:[0-9]+)?$/.test(origin) ||
          origin.startsWith("http://18.233.6.248") ||
          origin.startsWith("https://18.233.6.248");
        if (isAllowed) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
      },
      credentials:true,
   }
});

const userSocketMap={};

function getReceiverSocketId(userId){
   return userSocketMap[userId];
}


io.on("connection",(Socket)=>{
   // console.log("A user Connected :-" ,Socket.id);

   const userId = Socket.handshake.query.userId;
   if(userId) userSocketMap[userId] = Socket.id;

   io.emit("getOnlineUsers",Object.keys(userSocketMap));

   Socket.on("disconnect",()=>{
      // console.log("A user disconnected:-",Socket.id);
      
      delete userSocketMap[userId];

      io.emit("getOnlineUsers",Object.keys(userSocketMap));   
   })
})

// export {server , app ,io};
module.exports = {getReceiverSocketId,server , app ,io};