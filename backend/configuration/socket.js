const express = require("express")
const http = require("http");
const {Server} = require("socket.io")

console.log("in the socket page ");

const app = express();
const server =http.createServer(app);


const io = new Server(server,{
   cors : {
      origin:"http://localhost:3000",
      credentials:true,
   }
});

const userSocketMap={};

function getReceiverSocketId(userId){
   return userSocketMap[userId];
}


io.on("connection",(Socket)=>{
   console.log("A user Connected :-" ,Socket.id);

   const userId = Socket.handshake.query.userId;
   if(userId) userSocketMap[userId] = Socket.id;

   io.emit("getOnlineUsers",Object.keys(userSocketMap));

   Socket.on("disconnect",()=>{
      console.log("A user disconnected:-",Socket.id);
      
      delete userSocketMap[userId];

      io.emit("getOnlineUsers",Object.keys(userSocketMap));   
   })
})

// export {server , app ,io};
module.exports = {getReceiverSocketId,server , app ,io};