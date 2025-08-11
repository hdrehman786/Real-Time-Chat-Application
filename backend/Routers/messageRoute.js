
import { Router } from "express";
import { auth } from "../Midleware/auth.js";
import { getAllMessage, getAllUser, sendMessage } from "../Controller/messageController.js";
import upload from "../utills/upload.js";

const messageRouter = Router();

messageRouter.get("/allusers",auth,getAllUser);
messageRouter.get("/get-messages/:id",auth,getAllMessage);
messageRouter.post("/sendmessage/:id",auth,upload.single("image"),sendMessage);


export default messageRouter