import http from "http"
import express from "express"
import { Server } from "socket.io"
let app = express();

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: ["https://spill-the-tea-4251.onrender.com"],
        methods: ["GET", "POST"]
    }
})


const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on("connection",(socket)=>{

    const userId = socket.handshake.query.userId
    if(userId !== undefined && userId !== "undefined"){
        userSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    

    socket.on("disconnect" , ()=>{
        if (userId !== undefined && userId !== "undefined") {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})
    
export { app, server, io, userSocketMap }
