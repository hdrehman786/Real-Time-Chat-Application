import { Router } from "express";
import { imageUpload } from "../Controller/ImageUploadController.js";
import { auth } from "../Midleware/auth.js";
import upload from "../utills/upload.js";

const imageRouter = Router();

imageRouter.post("/upload",auth,upload.single("image"),imageUpload);


export default imageRouter