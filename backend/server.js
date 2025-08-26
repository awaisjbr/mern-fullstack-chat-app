import express from "express";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { router as authRouter } from "./routes/auth.route.js";
import {router as messageRouter} from "./routes/message.route.js"


dotenv.config();
const port = process.env.PORT;
const allowedOrigins = ['https://mern-chat-app-orpin-psi.vercel.app', 'http://localhost:3000'];

const app = express();
const server = http.createServer(app);
// export const io = new Server(server, {
//     cors: {
//         origin: allowedOrigins,
//         methods: ["GET","POST"]
//     }
// });

// const onlineUsers = {};
// export function getReceiverSocketId(userId){
//     return onlineUsers[userId]
// };
// io.on("connection", (socket) => {
//     console.log("A User coneected", socket.id);
//    const userId = socket.handshake.query.userId;
//     if(userId){
//         onlineUsers[userId]= socket.id;
//     }
//     io.emit("getOnlineUsers", Object.keys(onlineUsers));

//     socket.on("disconnect", () => {
//         console.log("A User Disconnected", socket.id)
//         delete onlineUsers[userId];
//         io.emit("getOnlineUsers", Object.keys(onlineUsers));
//     })
// });

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use("/api/auth", authRouter);
// app.use("/api/message", messageRouter);
app.get("/", (req, res) => {
    res.send("Backend working fine..")
});

connectDB()
.then(() => {
    server.listen(port, () => {
        console.log(`server is listening on port : ${port}`);
    })
}).catch((error) => console.log(error.message))
