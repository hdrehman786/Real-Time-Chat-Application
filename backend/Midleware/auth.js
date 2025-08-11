import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    const token =req.cookies.token;
    try {
        if (!token) {
           return res.json({
                message: "Token has not found",
                error: true,
                success: false
            })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.user._id;
        return next();
    } catch (error) {
        res.json({
            message: error || error.message,
            error: true,
            success: false
        })
    }

}