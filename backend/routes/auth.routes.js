import express from "express"
import { signUp, login, logOut } from "../controllers/auth.controller.js"
const authRoute = express.Router();

authRoute.post("/signup",signUp)
authRoute.post("/login",login)
authRoute.get("/logout",logOut)

export default authRoute;