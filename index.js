import express, { Router } from "express"
import http from "http"
import "dotenv/config"
import cors from "cors";
import bodyParser from "body-parser";
import db from "./src/db/db.js";
import walletRouter from "./src/router/walletRouter.js"
import adminRouter from "./src/router/adminRouter.js"
import socket_server from "./socket.js";
const app=express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: '20mb' }));


app.use("/api",walletRouter);
app.use("/api",adminRouter)
const server= http.createServer(app);
socket_server(server);
server.listen(process.env.port,()=>{
    console.log(`server is running on ${process.env.port}...`)
})
