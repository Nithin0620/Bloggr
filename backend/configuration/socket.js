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
   "http://YOUR_EC2_PUBLIC_IP:3000",
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
      origin: allowedOrigins,
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