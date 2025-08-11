import Message from "../Models/messageModel.js";
import User from "../Models/userModel.js";
import cloudinary from "../utills/cloudnary.js";
import { getReceiverSocketId, io } from "../utills/socket.js";


export const getAllUser = async (req, res) => {

    try {
        const loggedInUser = req.id;

        const users = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

        res.json(users)
    } catch (error) {
        res.json({
            status: false,
            message: error.message || error || "Error during fetching user data",
            error: true
        })
    }
}


export const getAllMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const myId = req.id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: id },
                { senderId: id, receiverId: myId }
            ]
        })

        res.json({
            status: true,
            message: "Messages fetched successfully",
            data: messages,
            error: false
        })

    } catch (error) {
        res.json({
            status: false,
            message: error.message || error || "Error during fetching message data",
            error: true
        })
    }
}


export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { text,image } = req.body; 
    const senderId = req.id;

  
    if (!text && !image) {
      return res.status(400).json({
        status: false,
        message: "Cannot send an empty message.",
      });
    }


    const newMessage = new Message({
      senderId,
      receiverId,
      message: text || "",
      image: image,    
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if(receiverId){
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
