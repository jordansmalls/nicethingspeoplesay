import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { env } from "../config/env.js"

const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, env.jwtSecret);

            req.user = await User.findById(decoded.userId).select("-password");

            next();
        } catch (err) {
            console.error(err);
            res.status(401);
            return res.status(401).json({ message: "Not authorized, token failed." });
        }
    } else {
        res.status(401);
        return res.status(401).json({ message: "Not authorized, no token." });
    }
};

export { protect };
