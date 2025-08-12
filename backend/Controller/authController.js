import bcrypt from 'bcrypt';
import User from '../Models/userModel.js';
import genrateToken from '../utills/genratetoken.js';
import cloudinary from '../utills/cloudnary.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
        error: true,
      });
    }

    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.json({
    //     success: false,
    //     message: "Email already exists",
    //     error: true,
    //   });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    if (!user) {
      return res.json({
        success: false,
        message: "User was not created",
        error: true,
      });
    }

    return res.json({
      message: "User created successfully",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.json({
      message: error.message || "Error during registration",
      error: true,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
        error: true,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: true,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
        error: true,
      });
    }

    const token = await genrateToken(user);

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };

    res.cookie("token", token, cookieOption);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      error: false,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error during login",
      error: true,
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "User logged out successfully",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.json({
      message: error.message || "Error during logout",
      error: true,
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const file = req.file;
    const id = req.id;

    if (!id) {
      return res.json({
        message: "User not found",
        error: true,
        success: false,
      })
    }

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
        error: true,
      });
    }

    // Upload the buffer to Cloudinary using upload_stream
    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer); // send buffer to Cloudinary
      });
    };

    const uploadedImage = await uploadFromBuffer();


    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePicture: uploadedImage.secure_url },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      error: false,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    return res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
};



export const checkAuth = async (req, res) => {
  const id = req.id;
  if (!id) {
    return res.json({ message: "User ID is not found", success: false, })
  }
  try {

    const user = await User.findById(id).select("-password");
    return res.json({
      message: "User is authenticated",
      error: false,
      success: true,
      user: user,
    });
  } catch (error) {
    return res.json({
      message: error.message || "Error during checking auth",
      error: true,
      success: false,
    });
  }
};
