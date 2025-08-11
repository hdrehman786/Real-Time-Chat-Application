import jwt from "jsonwebtoken";

const genrateToken = async (user) => {
    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: '7day'
    })
    return token
}

export default genrateToken;