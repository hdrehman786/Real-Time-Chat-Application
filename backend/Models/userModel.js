
import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    name : {
    type : String,
    required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    profilePicture : {
        type : String,
        default : 'https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_1280.png'
    }
},{timestamps : true})


const User = new mongoose.model("User", userSchema);

export default User;