import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import connectDb from "./config/db.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import messageRoute from "./routes/message.routes.js";
import cors from "cors";
dotenv.config();

const port = process.env.PORT || 5000

import { app, server } from "./socket/socket.js";

// connecting backend with frontend
app.use(cors({
    origin: "https://spill-the-tea-4251.onrender.com",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/message", messageRoute)

app.get("/", (req, res) => {
    res.send("hello");
})


server.listen(port, () => {
    connectDb();
    console.log(`server is running at ${port}`)
})

