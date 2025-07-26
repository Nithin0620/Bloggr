const express = require("express")
const http = require("http");
const {Server} = require("socket.io")
require("dotenv").config();
// console.log("in the socket page ");

const app = express();
const server =http.createServer(app);


const io = new Server(server,{
   cors : {
      origin:`${process.env.ENVIRONMENT === "development"? "http://localhost:3000" : "https://bloggr-y7gx.onrender.com"}`,
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