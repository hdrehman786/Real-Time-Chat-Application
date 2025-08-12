import express from 'express';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './Routers/userRouter.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import messageRouter from './Routers/messageRoute.js';
import multer from 'multer';
import imageRouter from './Routers/imageRoutes.js';
import { app,server } from './utills/socket.js';


configDotenv();

const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: "https://real-time-chat-application-lyart-six.vercel.app",
  credentials: true
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, }));

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/image",imageRouter)
server.listen(port, () => {
  console.log(`App is running on port ${port}`);
  connectDB();
});
