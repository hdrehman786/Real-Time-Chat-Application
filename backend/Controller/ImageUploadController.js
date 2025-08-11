import cloudinary from "../utills/cloudnary.js";

export const imageUpload = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false
            });
        }

        // Cloudinary upload
        const uploadedImage = await new Promise((resolve, reject) => {
            const upload_stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            upload_stream.end(file.buffer);
        });

        // Send success response
        res.status(200).json({
            message: "Image uploaded successfully",
            success: true,
            error: false,
            url: uploadedImage.secure_url
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong while uploading the image",
            error: true,
            success: false
        });
    }
};
