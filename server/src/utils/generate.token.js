import jwt from "jsonwebtoken";
import { env } from "../config/env.js"

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, env.jwtSecret, {
        expiresIn: "30d",
    });

    return res.cookie("jwt", token, {
        httpOnly: true,
        // use secure cookies in production
        secure: env.nodeEnv !== "development",
        // prevent CSRF attacks
        sameSite: "lax",
        // 30 days
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

export default generateToken;
