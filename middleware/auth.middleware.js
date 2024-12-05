import jwt from "jsonwebtoken";
import { JWT_AUTH_SECRET_KEY } from "../config.js";

export const authenticateToken = (req, res, next) => {
    const token = req.cookies?.["jwtToken"];

    if (!token) {
        return res.status(401).json({ error: "Try login in again" });
    }

    try {
        const decoded = jwt.verify(token, JWT_AUTH_SECRET_KEY);
        req.user_id = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Try login in again" });
    }
};
