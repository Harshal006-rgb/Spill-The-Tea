import isAuth from "../middlewares/isAuth.js";
import express from "express"
import { upload } from "../middlewares/multer.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const messageRoute = express.Router();

messageRoute.post("/send/:receiver", isAuth, upload.single("image"), sendMessage)
messageRoute.get("/get/:receiver", isAuth, getMessage)

export default messageRoute;