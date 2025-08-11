import { Router } from "express";
import { checkAuth, login, logout, register, updateProfile } from "../Controller/authController.js";
import { auth } from "../Midleware/auth.js";
import upload from "../utills/upload.js";


const authRouter = Router();

authRouter.post("/register",register);
authRouter.post("/login", login);
authRouter.post("/logout",logout);
authRouter.put("/update-profile",upload.single("image"),auth,updateProfile);
authRouter.get("/check",auth,checkAuth);

export default authRouter;