import { editProfile, getCurrentUser, getOtherUsers ,search } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import express from "express"
import { upload } from "../middlewares/multer.js";

const userRoute = express.Router();

userRoute.get("/current", isAuth , getCurrentUser)
userRoute.get("/other", isAuth , getOtherUsers)
userRoute.put("/profile", isAuth , upload.single("image") , editProfile)
userRoute.get("/search", isAuth , search)

export default userRoute;