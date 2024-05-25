import jwt from 'jsonwebtoken';
import User from '../schema/user.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        if (!token) {
            return res.status(401).send("Please log in first.");
        }

        const decode = jwt.verify(token, "greensafar123");
        const user = await User.findOne({ username: decode.username });

        if (!user) {
            throw new Error("User not found.");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).send("Authentication failed.");
    }
};
