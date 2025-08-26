import express from "express";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db.js";


dotenv.config();
const port = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ["GET","POST"]
    }
})

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.get("/", (req, res) => {
    res.send("Backend working fine..")
});

connectDB()
.then(() => {
    server.listen(port, () => {
        console.log(`server is listening on port : ${port}`);
    })
}).catch((error) => console.log(error.message))
